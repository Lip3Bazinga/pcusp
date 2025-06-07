import { Request, Response, NextFunction } from "express"
import { CatchAsyncError } from "../middleware/catchAsyncErros"
import ErrorHandler from "../utils/ErrorHandlers"
import orderModel, { IOrder } from "../models/order.model"
import userModel from "../models/user.model"
import CourseModel from "../models/course.model"
import NotificationsModel from "../models/notificationModel"
import path from "path"
import ejs from "ejs"
import sendMail from '../utils/sendMail';
import { newOrder } from "../services/order.service"

// Criando pedido
export const createOrder = CatchAsyncError(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { courseId } = req.body as IOrder

    const user = await userModel.findById(req.user?._id)

    const courseExistsInUser = user?.courses.some((course: any) => course._id.toString() === courseId)

    if (courseExistsInUser) return next(new ErrorHandler("Você já adquiriu este curso.", 400))

    const course = await CourseModel.findById(courseId)

    if (!course) return next(new ErrorHandler("Curso não encontrado", 400))

    if (!user || !user._id) return next(new ErrorHandler("Usuário não encontrado ou ID do usuário não disponível", 404))

    const data: any = {
      courseId: course._id,
      userId: user?._id
    }

    const mailData = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        date: new Date().toLocaleDateString("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      }
    }

    const html = await ejs.renderFile(path.join(__dirname, "../mails/orderConfirmation.ejs"), {
      order: mailData
    })

    try {
      if (user) {
        await sendMail({
          email: user.email,
          subject: "Pedido confirmado",
          template: "orderConfirmation.ejs",
          data: mailData,
        })
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500))
    }

    user?.courses.push(course?._id)

    await user?.save()

    await NotificationsModel.create({
      user: user?._id,
      title: "Novo pedido",
      message: `Você tem um novo pedido de: ${course?.name}`
    })

    newOrder(data, res, next)

  } catch (error: any) {
    next(new ErrorHandler(error.message, 500))
  }
})