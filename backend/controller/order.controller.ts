import type { NextFunction, Request, Response } from "express"
import { CatchAsyncError } from "../middleware/catchAsyncErros"
import ErrorHandler from "../utils/ErrorHandlers"
import type { IOrder } from "../models/order.model"
import userModel from "../models/user.model"
import CourseModel from "../models/course.model"
import path from "path"
import ejs from "ejs"
import sendMail from "../utils/sendMail"
import { newOrder } from "../services/order.service"

// Create order
export const createOrder = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId } = req.body as IOrder

    const user = await userModel.findById(req.user?._id)

    const courseExistInUser = user?.courses.some((course: any) => course._id.toString() === courseId)

    if (courseExistInUser) {
      return next(new ErrorHandler("Você já comprou este curso", 400))
    }

    const course = await CourseModel.findById(courseId)

    if (!course) {
      return next(new ErrorHandler("Curso não encontrado", 404))
    }

    const data: any = {
      courseId: course._id,
      userId: user?._id,
    }

    const mailData = {
      order: {
        _id: course._id.toString().slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    }

    const html = await ejs.renderFile(path.join(__dirname, "../mails/orderConfirmation.ejs"), { order: mailData })

    try {
      if (user) {
        await sendMail({
          email: user.email,
          subject: "Confirmação de Pedido",
          template: "orderConfirmation.ejs",
          data: mailData,
        })
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }

    user?.courses.push(course?._id)

    await user?.save()

    newOrder(data, res, next)
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
})
