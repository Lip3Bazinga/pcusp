import express from "express"
import {
  activateUser,
  registrationUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateProfilePicture,
} from "../controller/user.controller"
import { isAuthenticated } from "../middleware/auth"

const userRouter = express.Router()

userRouter.post("/registration", registrationUser)
userRouter.post("/activate-user", activateUser)
userRouter.post("/login", loginUser)
userRouter.get("/logout", isAuthenticated, logoutUser)
userRouter.get("/refresh", updateAccessToken)
userRouter.get("/me", isAuthenticated, getUserInfo)
userRouter.post("/social-auth", socialAuth)
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo)
userRouter.put("/update-user-password", isAuthenticated, updatePassword)
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture)

export default userRouter
