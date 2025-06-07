"use client";

import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import CustomModal from "../utils/CustomModal";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp"
import Verification from "../components/Auth/Verification"
import { useSelector } from "react-redux"
import Image from "next/image";
import avatar from "../../public/assets/avatar.png"

import Logo from "../../public/assets/logo_dark.png"; // Verifique este caminho
import { useSession } from "next-auth/react"
import Page from "../profile/page"
import router, { useRouter } from "next/router";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const { user } = useSelector((state: any) => state.auth)
  const { data } = useSession()
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation()
  const [logout, setLogout] = useState(false)
  const { } = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  })

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data?.user?.email,
          name: data?.user?.name,
          avatar: data?.user?.image
        })
      }
    }
    if (data === null) {
      if (isSuccess) toast.success("Login realizado com sucesso.")
    }
    if (data === null) {
      setLogout(true)
    }
  }, [data, user])

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup para evitar vazamentos de memória
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "screen") {
      setOpenSideBar(false);
    }
  };

  return (
    <header className="w-full relative">
      <div className={active
        ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[100px] z-[80] border-b dark:border-[#FFFFFF1C] shadow-xl transition duration-500"
        : "w-full border-b dark:border-[#FFFFFF1C] h-[80px] z-[80] dark:shadow"
      }>
        <div className="w-[95%] m-auto py-2 h-full flex items-center justify-between">
          <Link href="/" className="relative w-[80px] h-[80px]">
            <Image
              src={Logo}
              alt="Logo"
              className="absolute top-0 left-0 w-full h-full object-cover"
              width={80}
              height={80}
            />
          </Link>
          <div className="flex items-center justify-center w-full h-full">
            <NavItems activeItem={activeItem} isMobile={false} />
            <div className="800px:hidden">
              <HiOutlineMenuAlt3
                size={25}
                className="cursor-pointer dark:text-white text-black"
                onClick={() => setOpenSideBar(true)}
              />
            </div>
          </div>
          <ThemeSwitcher />
          {user ? (
            <Link href={"/profile"}>
              <Image
                src={user.avatar ? user.avatar.url : avatar}
                alt="Usuário"
                width={30}
                height={30}
                className={`w-[30px] h-[30px] object-contain cursor-pointer rounded-full ${!data?.user?.image ? "dark:invert" : ""}`}
                onClick={() => setRoute("Profile")}
              />
            </Link>
          ) : (
            <HiOutlineUserCircle
              size={25}
              className="hidden 800px:block cursor-pointer dark:text-white text-black"
              onClick={() => setOpen(true)}
            />
          )
          }
        </div>

        {openSideBar && (
          <div
            className="fixed w-full h-screen top-0 left-0 z-[99999] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
          </div>
        )}
      </div>

      {route === "Login" && open && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Login}
        />
      )}

      {route === "Sign-Up" && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={SignUp}
        />
      )}

      {route === "Verification" && (
        <CustomModal
          open={open}
          setOpen={setOpen}
          setRoute={setRoute}
          activeItem={activeItem}
          component={Verification}
        />
      )}

    </header>
  );
};

export default Header;
