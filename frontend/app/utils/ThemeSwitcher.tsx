"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { BiMoon, BiSun } from "react-icons/bi"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center mx-4">
      {
        theme === "light" ? (
          <BiMoon
            className="cursor-pointer"
            fill="black"
            size={25}
            onClick={() => setTheme("dark")}
          />

        ) : (
          <BiSun
            className="cursor-pointer"
            size={25}
            fill="white"
            onClick={() => setTheme("light")}
          />
        )
      }
    </div>
  )

}
