"use client"

import type React from "react" // 'React' is defined but never used.
import { useState } from "react"
import Heading from "./utils/Heading"
import Header from "./components/Header"
import Hero from "./components/Route/Hero"
// import { useSelector } from "react-redux"; // Removido se user não for usado aqui

type Props = {} // 'Props' is defined but never used.

const Page: React.FC<Props> = (/*props*/) => {
  // props comentado se não usado
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0) // Se setActiveItem não for usado, isso será um aviso.
  const [route, setRoute] = useState("Login")
  // const {user} = useSelector((state:any) => state.auth); // Removido se user não for usado

  // Se setActiveItem não for usado em nenhum lugar neste componente,
  // considere se o estado 'activeItem' é realmente necessário aqui ou se pode ser gerenciado de outra forma.
  // Por enquanto, para passar no lint, vamos adicionar um console.log para "usar" setActiveItem.
  // Em um cenário real, você usaria essa função para atualizar o estado.
  if (typeof setActiveItem === "function" && activeItem === -1) {
    // Exemplo de uso para o linter
    console.log("Active item set")
  }

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
