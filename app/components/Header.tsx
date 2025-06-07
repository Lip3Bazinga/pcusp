"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
// import NavItems from '../utils/NavItems'; // Supondo que este componente exista
// import ThemeSwitcher from '../utils/ThemeSwitcher'; // Supondo que este componente exista
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  activeItem: number
  route?: string
  setRoute?: (route: string) => void
}

const Header: React.FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false)
  const [openSidebar, setOpenSidebar] = useState(false)

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setActive(true)
      } else {
        setActive(false)
      }
    })
  }

  const handleClose = (e: React.MouseEvent) => {
    // Lógica para fechar sidebar, se necessário
  }

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link href={"/"} className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>
                LMS Platform
              </Link>
            </div>
            <div className="flex items-center">
              {/* <NavItems activeItem={activeItem} isMobile={false} /> */}
              {/* <ThemeSwitcher /> */}
              {/* Mobile sidebar */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <HiOutlineUserCircle
                size={25}
                className="hidden 800px:block cursor-pointer dark:text-white text-black"
                onClick={() => setOpen(true)} // Supondo que setOpen controla um modal de login/perfil
              />
            </div>
          </div>
        </div>
        {/* Implementação do Mobile Sidebar aqui, se necessário */}
      </div>
    </div>
  )
}

export default Header
