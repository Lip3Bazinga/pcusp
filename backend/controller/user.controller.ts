import type { Request, Response, NextFunction } from "express"
import userModel, { type IUser } from "../models/user.model"
import ErrorHandler from "../utils/ErrorHandlers"
import { CatchAsyncError } from "../middleware/catchAsyncErros"
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken"
import ejs from "ejs"
import path from "path"
import sendMail from "../utils/sendMail"
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt"
import { redis } from "../utils/redis"
import { getUserById } from "../services/user.service"
import cloudinary from "cloudinary"

// Register user
interface IRegistrationBody {
  name: string
  email: string
  password: string
  avatar?: string
}

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    const isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) {
      return next(new ErrorHandler("Email já existe", 400))
    }

    const user: IRegistrationBody = {
      name,
      email,
      password,
    }

    const activationToken = createActivationToken(user)

    const activationCode = activationToken.activationCode

    const data = { user: { name: user.name }, activationCode }
    const html = await ejs.renderFile(path.join(__dirname, "../mails/activationMail.ejs"), data)

    try {
      await sendMail({
        email: user.email,
        subject: "Ative sua conta",
        template: "activationMail.ejs",
        data,
      })

      res.status(201).json({
        success: true,
        message: `Por favor verifique seu email: ${user.email} para ativar sua conta!`,
        activationToken: activationToken.token,
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400))
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

interface IActivationToken {
  token: string
  activationCode: string
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    },
  )

  return { token, activationCode }
}

// Activate user
interface IActivationRequest {
  activation_token: string
  activation_code: string
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activation_token, activation_code } = req.body as IActivationRequest

    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET as string,
    ) as { user: IUser; activationCode: string }

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Código de ativação inválido", 400))
    }

    const { name, email, password } = newUser.user

    const existUser = await userModel.findOne({ email })

    if (existUser) {
      return next(new ErrorHandler("Email já existe", 400))
    }
    const user = await userModel.create({
      name,
      email,
      password,
    })

    res.status(201).json({
      success: true,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Login user
interface ILoginRequest {
  email: string
  password: string
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginRequest

    if (!email || !password) {
      return next(new ErrorHandler("Por favor entre com email e senha", 400))
    }

    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
      return next(new ErrorHandler("Email ou senha inválidos", 400))
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Email ou senha inválidos", 400))
    }

    sendToken(user, 200, res)
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Logout user
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 })
    res.cookie("refresh_token", "", { maxAge: 1 })
    const userId = req.user?._id || ""
    redis.del(userId)
    res.status(200).json({
      success: true,
      message: "Deslogado com sucesso",
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Update access token
export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token as string
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload

    const message = "Não foi possível atualizar token"
    if (!decoded) {
      return next(new ErrorHandler(message, 400))
    }
    const session = await redis.get(decoded.id as string)

    if (!session) {
      return next(new ErrorHandler("Por favor faça login para acessar este recurso!", 400))
    }

    const user = JSON.parse(session)

    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
      expiresIn: "5m",
    })

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
      expiresIn: "3d",
    })

    req.user = user

    res.cookie("access_token", accessToken, accessTokenOptions)
    res.cookie("refresh_token", refreshToken, refreshTokenOptions)

    await redis.set(user._id, JSON.stringify(user), "EX", 604800)

    res.status(200).json({
      status: "success",
      accessToken,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Get user info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id
    getUserById(userId, res)
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

interface ISocialAuthBody {
  email: string
  name: string
  avatar: string
}

// Social auth
export const socialAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, avatar } = req.body as ISocialAuthBody
    const user = await userModel.findOne({ email })
    if (!user) {
      const newUser = await userModel.create({ email, name, avatar })
      sendToken(newUser, 200, res)
    } else {
      sendToken(user, 200, res)
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Update user info
interface IUpdateUserInfo {
  name?: string
  email?: string
}

export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body as IUpdateUserInfo

    const userId = req.user?._id
    const user = await userModel.findById(userId)

    if (name && user) {
      user.name = name
    }

    await user?.save()

    await redis.set(userId, JSON.stringify(user))

    res.status(201).json({
      success: true,
      user,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Update user password
interface IUpdatePassword {
  oldPassword: string
  newPassword: string
}

export const updatePassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body as IUpdatePassword

    if (!oldPassword || !newPassword) {
      return next(new ErrorHandler("Por favor entre com a senha antiga e nova", 400))
    }

    const user = await userModel.findById(req.user?._id).select("+password")

    if (user?.password === undefined) {
      return next(new ErrorHandler("Usuário inválido", 400))
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword)

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Senha antiga inválida", 400))
    }

    user.password = newPassword

    await user.save()

    await redis.set(req.user?._id, JSON.stringify(user))

    res.status(201).json({
      success: true,
      user,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})

// Update profile picture
interface IUpdateProfilePicture {
  avatar: string
}

export const updateProfilePicture = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body as IUpdateProfilePicture

    const userId = req.user?._id

    const user = await userModel.findById(userId).select("+password")

    if (avatar && user) {
      if (user?.avatar?.public_id) {
        await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        })
        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
      } else {
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        })

        user.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        }
      }
    }

    await user?.save()

    await redis.set(userId, JSON.stringify(user))

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400))
  }
})
