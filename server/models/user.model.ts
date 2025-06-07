import 'dotenv/config';
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface IUser extends Document {
  _id: string
  name: string,
  email: string,
  password: string,
  avatar: {
    public_id: string,
    url: string
  },
  role: string,
  isVerified: boolean,
  // courses: Array<{ courseId: string }>,
  courses: mongoose.Types.ObjectId[],
  comparePassword: (password: string) => Promise<boolean>,
  SignAccessToken: () => string,
  SignRefreshToken: () => string,

}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Digite seu nome..."]
  },
  email: {
    type: String,
    required: [true, "Digite seu email..."],
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value)
      },
      message: "Por favor entre com um email válido."
    },
    unique: true
  },
  password: {
    type: String,
    // required: [true, "Digite sua senha..."],
    minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
    select: false
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    default: "Usuário"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  courses: [
    {
      courseId: String,
    }
  ],
}, {
  timestamps: true
})


// Hash Password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.ACCESS_TOKEN || "",
    {
      expiresIn: "5m",
    }
  )
}

// Sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({
    id: this._id
  },
    process.env.REFRESH_TOKEN || "",
    {
      expiresIn: "3d"
    }
  )
}

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

const userModel: Model<IUser> = mongoose.model("User", userSchema)

export default userModel