import NextAuth from "next-auth"

export const authOptions = {
  providers: [],
  secret: process.env.SECRET,
}

export default NextAuth(authOptions)
