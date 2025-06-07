import type { NextFunction, Response } from "express"
import { CatchAsyncError } from "../middleware/catchAsyncErros"
import OrderModel from "../models/order.model"

// Create new order
export const newOrder = CatchAsyncError(async (data: any, res: Response, next: NextFunction) => {
  const order = await OrderModel.create(data)

  res.status(201).json({
    success: true,
    order,
  })
})
