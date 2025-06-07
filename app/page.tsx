"use client"

import type React from "react"
import { useState } from "react"
import Heading from "./utils/Heading"
import Header from "./components/Header"
import Hero from "./components/Route/Hero"

type Props = {}

const Page: React.FC<Props> = () => {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)
  const [route, setRoute] = useState("Login")

  return (
    <div>
      <Heading
        title="Plataforma PC-USP"
        description="A plataforma é uma iniciativa da USP que visa democratizar o acesso de cursos de qualidade de programação em solo brasileiro, por meio de uma plataforma gratuita de cursos online com certificações."
        keywords="Programação, Pensamento Computacional, USP"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />
      <Hero />
    </div>
  )
}

export default Page
