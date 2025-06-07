"use client"
import { useRouter } from "next/navigation"
import useUserAuth from "./userAuth"
import type React from "react"
import { useEffect, useState } from "react"
import Loader from "../components/Loader/Loader"

interface ProtectedProps {
  children: React.ReactNode
}

export default function Protected({ children }: ProtectedProps): React.ReactNode {
  const isAuthenticated = useUserAuth()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    if (typeof isAuthenticated === "boolean") {
      if (!isAuthenticated) {
        router.push("/")
      }
      setIsVerifying(false)
    }
  }, [isAuthenticated, router])

  if (isVerifying) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Loader />
  }

  return <>{children}</>
}
