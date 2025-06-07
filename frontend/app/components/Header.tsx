"use client"

import Link from "next/link"
import type React from "react"
import { type FC, useState, useEffect } from "react"
import NavItems from "../utils/NavItems"
import ThemeSwitcher from "../utils/ThemeSwitcher"
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi"
import CustomModal from "../utils/CustomModal"
import Login from "../components/Auth/Login"
import SignUp from "../components/Auth/SignUp"
import Verification from "../components/Auth/Verification"
import { useSelector } from "react-redux"
import Image from "next/image"
import avatar from "../../public/assets/avatar.png"
import Logo from "../../public/assets/logo_dark.png"
import { useSession } from "next-auth/react"
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi"
import toast from "react-hot-toast"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  activeItem: number
  route: string
  setRoute: (route: string) => void
}

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false)
  const [openSideBar, setOpenSideBar] = useState(false)
  const { user } = useSelector((state: any) => state.auth)
  const { data: sessionData } = useSession() // Renomeado data para sessionData
  const [socialAuth, { isSuccess, error: socialAuthError }] = useSocialAuthMutation() // error renomeado
  const [logout, setLogout] = useState(false)

  useLogOutQuery(undefined, {
    // Removida desestruturação vazia
    skip: !logout ? true : false,
  })

  useEffect(() => {
    if (!user) {
      if (sessionData) {
        socialAuth({
          email: sessionData?.user?.email,
          name: sessionData?.user?.name,
          avatar: sessionData?.user?.image,
        })
      }
    }
    if (sessionData === null) {
      // Usando sessionData
      if (isSuccess) {
        toast.success("Login realizado com sucesso.")
      }
    }
    if (sessionData === null) {
      // Usando sessionData
      setLogout(true)
    }
    if (socialAuthError) {
      // Verificando socialAuthError
      if ("data" in socialAuthError) {
        const errorData = socialAuthError.data as any
        toast.error(errorData.message || "Erro na autenticação social")
      } else {
        toast.error("Ocorreu um erro na autenticação social.")
      }
    }
  }, [sessionData, user, socialAuth, isSuccess, socialAuthError]) // Adicionado socialAuth e socialAuthError

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "screen") {
      setOpenSideBar(false)
    }
  }

  return (
    <header className="w-full relative">
      <div
        className={
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#FFFFFF1C] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#FFFFFF1C] h-[80px] z-[80] dark:shadow"
        }
      >
        <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link href={"/"} className="flex items-center">
                <Image src={Logo || "/placeholder.svg"} alt="PCUSP Logo" width={60} height={60} />{" "}
                {/* Tamanho ajustado */}
                <span className="text-[25px] font-Poppins uppercase font-[500] text-black dark:text-white ml-2">
                  PCUSP
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              {/* For Mobile */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSideBar(true)}
                />
              </div>
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt="User Profile"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full cursor-pointer object-cover" // Adicionado object-cover
                    style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="hidden 800px:block cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {openSideBar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              {user ? (
                <Link href={"/profile"}>
                  <Image
                    src={user.avatar ? user.avatar.url : avatar}
                    alt="User Profile Mobile"
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] rounded-full ml-5 cursor-pointer object-cover" // Adicionado object-cover
                    style={{ border: activeItem === 5 ? "2px solid #37a39a" : "none" }}
                  />
                </Link>
              ) : (
                <HiOutlineUserCircle
                  size={25}
                  className="cursor-pointer ml-5 my-2 dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              )}
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">Copyright © 2024 PCUSP</p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={Login} />
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModal open={open} setOpen={setOpen} setRoute={setRoute} activeItem={activeItem} component={SignUp} />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </header>
  )
}

export default Header
