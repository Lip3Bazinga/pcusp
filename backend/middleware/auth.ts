import { Request, Response, NextFunction } from "express"
import { CatchAsyncError } from "./catchAsyncErros"
import ErrorHandler from "../utils/ErrorHandlers"
import jwt, { JwtPayload } from "jsonwebtoken"
import { redis } from "../utils/redis"

// Authenticated user
export const isAuthenticated = CatchAsyncError(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const access_token = req.cookies.access_token

  if (!access_token) {
    return next(new ErrorHandler("Por favor, faça login para acessar a página", 400))
  }

  try {
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload

    if (!decoded) {
      return next(new ErrorHandler("O Token de acesso não é válido.", 400))
    }

    const userId = decoded.id as string
    const user = await redis.get(userId)

    if (!user) return next(new ErrorHandler("Usuário não encontrado.", 400))

    req.user = JSON.parse(user)

    next()
  } catch (error: any) {
    return next(new ErrorHandler("O Token de acesso não é válido.", 400));
  }


})

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!roles.includes(req.user?.role || ""))
      return next(new ErrorHandler(`Função: ${req.user?.role}.Logo, o usuário não tem permissão para acessar este recurso`, 403))
    next()
  }
}