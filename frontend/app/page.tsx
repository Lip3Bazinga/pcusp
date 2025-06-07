"use client"

import type React from "react"
import { useState } from "react"
import Heading from "./utils/Heading"
import Header from "./components/Header"
import Hero from "./components/Route/Hero"

type Props = {}

const Page: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)
  const [route, setRoute] = useState("Login")

  return (
    <div>
      <Heading
        title="PCUSP"
        description="PCUSP é uma plataforma para aprender programação"
        keywords="Programação, MERN stack, Redux, Machine Learning"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} route={route} />
      <Hero />
    </div>
  )
}

export default Page
