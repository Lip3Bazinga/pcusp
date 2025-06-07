import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express"
export const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from "./routes/order.route"

// Body Parser
app.use(express.json({ limit: "50mb" }));

// Cookie Parser
app.use(cookieParser())

// Cors => Cross origin resource sharing
app.use(
  cors({
    // origin: process.env.ORIGIN,
    origin: ['http://localhost:3000'],
    credentials: true,
  })
)

//Routes
app.use("/api/v1", userRouter, orderRouter, courseRouter)

// Testing API
app.get("/test", (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  })
})

// Unknown route
app.all("*", (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any
  err.statusCode = 404
  next(err)
})

// Error 
app.use(ErrorMiddleware)