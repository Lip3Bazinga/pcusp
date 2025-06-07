import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "dotenv"
import mongoose from "mongoose"

// Configuração do ambiente
config()

// Exportações necessárias para o backend
export const userRouter = express.Router()
export const courseRouter = express.Router()
export const orderRouter = express.Router()

// Interfaces de usuário
export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  avatar: {
    public_id: string
    url: string
  }
  role: string
  isVerified: boolean
  courses: mongoose.Types.ObjectId[]
  comparePassword: (password: string) => Promise<boolean>
  SignAccessToken: () => string
  SignRefreshToken: () => string
}

// Modelo de usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: {
    public_id: String,
    url: String,
  },
  role: String,
  isVerified: Boolean,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
})

export const userModel = mongoose.model("User", userSchema)

// Modelo de curso
const courseSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  thumbnail: {
    public_id: String,
    url: String,
  },
  tags: String,
  level: String,
  demoUrl: String,
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
  reviews: [
    {
      user: Object,
      rating: Number,
      comment: String,
      commentReplies: [Object],
    },
  ],
  courseData: [
    {
      title: String,
      description: String,
      videoUrl: String,
      videoSection: String,
      videoLength: Number,
      videoPlayer: String,
      links: [{ title: String, url: String }],
      suggestion: String,
      questions: [
        {
          user: Object,
          question: String,
          questionReplies: [Object],
        },
      ],
    },
  ],
  ratings: Number,
  purchased: Number,
})

export const CourseModel = mongoose.model("Course", courseSchema)

// Modelo de pedido
export interface IOrder {
  courseId: string
  userId: string
  payment_info: object
}

const orderSchema = new mongoose.Schema(
  {
    courseId: String,
    userId: String,
    payment_info: Object,
  },
  { timestamps: true },
)

export const OrderModel = mongoose.model("Order", orderSchema)

// Serviços
export const createCourse = async (data: any, res: express.Response) => {
  const course = await CourseModel.create(data)
  res.status(201).json({
    success: true,
    course,
  })
}

export const newOrder = async (data: any, res: express.Response) => {
  const order = await OrderModel.create(data)
  res.status(201).json({
    success: true,
    order,
  })
}

export const getUserById = async (id: string, res: express.Response) => {
  const user = await userModel.findById(id)
  res.status(200).json({
    success: true,
    user,
  })
}

// Controllers
export const uploadCourse = async (req: express.Request, res: express.Response) => {
  try {
    const data = req.body
    const course = await CourseModel.create(data)
    res.status(201).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const editCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const data = req.body
    const course = await CourseModel.findByIdAndUpdate(id, data, { new: true })
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getSingleCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const course = await CourseModel.findById(id)
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getAllCourses = async (req: express.Request, res: express.Response) => {
  try {
    const courses = await CourseModel.find()
    res.status(200).json({
      success: true,
      courses,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getCourseByUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const course = await CourseModel.findById(id)
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const addQuestion = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, contentId, question } = req.body
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Curso não encontrado",
      })
    }
    // Lógica para adicionar pergunta
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const addAnswer = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, contentId, questionId, answer } = req.body
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Curso não encontrado",
      })
    }
    // Lógica para adicionar resposta
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const addReview = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { review, rating } = req.body
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Curso não encontrado",
      })
    }
    // Lógica para adicionar review
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const addReplyToReview = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, reviewId, comment } = req.body
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Curso não encontrado",
      })
    }
    // Lógica para adicionar resposta à review
    res.status(200).json({
      success: true,
      course,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const createOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, userId } = req.body
    const order = await OrderModel.create({
      courseId,
      userId,
    })
    res.status(201).json({
      success: true,
      order,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const registrationUser = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body
    const user = await userModel.create({
      name,
      email,
      password,
    })
    res.status(201).json({
      success: true,
      user,
      activationToken: "token_de_ativacao",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const activateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { activation_token, activation_code } = req.body
    // Lógica para ativar usuário
    res.status(200).json({
      success: true,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      })
    }
    // Lógica para login
    res.status(200).json({
      success: true,
      user,
      accessToken: "access_token",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const logoutUser = async (req: express.Request, res: express.Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const updateAccessToken = async (req: express.Request, res: express.Response) => {
  try {
    res.status(200).json({
      success: true,
      accessToken: "novo_access_token",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const getUserInfo = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const user = await userModel.findById(id)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const socialAuth = async (req: express.Request, res: express.Response) => {
  try {
    const { email, name, avatar } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      const newUser = await userModel.create({
        email,
        name,
        avatar,
      })
      res.status(201).json({
        success: true,
        user: newUser,
        accessToken: "access_token",
      })
    } else {
      res.status(200).json({
        success: true,
        user,
        accessToken: "access_token",
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const updateUserInfo = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { name, email } = req.body
    const user = await userModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
      },
      { new: true },
    )
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const updatePassword = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { oldPassword, newPassword } = req.body
    const user = await userModel.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      })
    }
    // Lógica para atualizar senha
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export const updateProfilePicture = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { avatar } = req.body
    const user = await userModel.findByIdAndUpdate(
      id,
      {
        avatar,
      },
      { new: true },
    )
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Frontend exports
export const useLoadUserQuery = () => ({
  data: null,
  isLoading: false,
  refetch: () => {},
})

export const useLogOutQuery = () => ({
  data: null,
  isLoading: false,
  refetch: () => {},
})

export const useSocialAuthMutation = () => [
  async () => ({
    data: {
      success: true,
    },
  }),
  { isLoading: false },
]

export const useLoginMutation = () => [
  async () => ({
    data: {
      success: true,
    },
  }),
  { isLoading: false },
]

export const useRegisterMutation = () => [
  async () => ({
    data: {
      success: true,
    },
  }),
  { isLoading: false },
]

export const useActivationMutation = () => [
  async () => ({
    data: {
      success: true,
    },
  }),
  { isLoading: false },
]

export const useUpdateAvatarMutation = () => [
  async () => ({
    data: {
      success: true,
    },
  }),
  { isLoading: false },
]

export const styles = {
  title: "text-[25px] text-black dark:text-white font-[500] font-Poppins text-center py-2",
  label: "text-[16px] font-Poppins text-black dark:text-white",
  input:
    "w-full text-black dark:text-white bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins",
  button:
    "flex flex-row justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] min-h-[45px] w-full text-[16px] font-Poppins font-semibold",
}

// Configuração do servidor Express
const app = express()

// Middleware
app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)

// Rotas
app.get("/api/v1/me", (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      name: "Usuário de Teste",
      email: "teste@example.com",
      role: "user",
    },
  })
})

app.post("/api/v1/registration", registrationUser)
app.post("/api/v1/activate-user", activateUser)
app.post("/api/v1/login", loginUser)
app.get("/api/v1/logout", logoutUser)
app.get("/api/v1/refresh", updateAccessToken)
app.post("/api/v1/social-auth", socialAuth)
app.put("/api/v1/update-user-info", updateUserInfo)
app.put("/api/v1/update-user-password", updatePassword)
app.put("/api/v1/update-user-avatar", updateProfilePicture)

app.post("/api/v1/create-course", uploadCourse)
app.put("/api/v1/edit-course/:id", editCourse)
app.get("/api/v1/get-course/:id", getSingleCourse)
app.get("/api/v1/get-courses", getAllCourses)
app.get("/api/v1/get-course-content/:id", getCourseByUser)
app.put("/api/v1/add-question", addQuestion)
app.put("/api/v1/add-answer", addAnswer)
app.put("/api/v1/add-review/:id", addReview)
app.put("/api/v1/add-reply", addReplyToReview)

app.post("/api/v1/create-order", createOrder)

// Exportação do Heading para frontend
export function Heading({ title, description, keywords }: { title: string; description: string; keywords: string }) {
  return null
}

// Exportação do Page para frontend
export function Page() {
  return null
}

// Exportação do app para serverless
export { app }
