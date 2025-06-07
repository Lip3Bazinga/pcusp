import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandlers";

export const ErrorMiddleware= (
  err:any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error"

  // Wrong mongodb id error
  if(err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`
    err = new ErrorHandler(message, 400)
  }

  // Duplicate Key error
  if(err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`
    err = new ErrorHandler(message, 400)
  }

  // Wrong JWT error
  if(err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`
    err = new ErrorHandler(message, 400)
  }

  // JWT expired error
  if(err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, try again`
    err = new ErrorHandler(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
}
