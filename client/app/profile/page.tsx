'use client'

import React, { FC, useState } from "react"
import Protected from "../hooks/useProtected"
import Heading from "@/app/utils/Heading"
import Header from "../components/Header"
import Profile from "../components/Profile/Profile"
import { useSelector } from "react-redux"

type Props = {}

const page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login")
  const { user } = useSelector((state: any) => state.auth)

  return (
    <div>
      <Protected>
        <Heading
          title={`${user?.name} Perfil`}
          description="A plataforma é uma iniciativa da USP que visa democratizar o acesso de cursos de qualidade de programação em solo brasileiro, por meio de uma plataforma gratuita de cursos online com certificações."
          keywords="Programação, Pensamento Computacional, USP"
        />
        <Header
          open={open}
          setOpen={setOpen}
          activeItem={activeItem}
          setRoute={setRoute}
          route={route}
        />
        <Profile user={user} />
      </Protected>
    </div>
  )
}
export default page