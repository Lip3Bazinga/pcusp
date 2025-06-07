"use client"

import { ThemeProvider } from "./utils/ThemeProvider"
import { Toaster } from "react-hot-toast"
import { Providers } from "./Provider"
import { SessionProvider } from "next-auth/react"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import Loader from "./components/Loader/Loader"
import type React from "react"

interface ClientLayoutWrapperProps {
  children: React.ReactNode
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // A query useLoadUserQuery pode precisar de um argumento vazio se for o caso.
  // Verifique a definição da sua query.
  const { isLoading } = useLoadUserQuery({})
  return <>{isLoading ? <Loader /> : <>{children}</>}</>
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  return (
    <Providers>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Custom>{children}</Custom>
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </SessionProvider>
    </Providers>
  )
}
