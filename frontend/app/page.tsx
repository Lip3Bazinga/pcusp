"use client"

import type React from "react"
import { useState } from "react"
import Heading from "./utils/Heading" // Certifique-se que este caminho e arquivo existem e exportam corretamente
import Header from "./components/Header" // Certifique-se que este caminho e arquivo existem e exportam corretamente
import Hero from "./components/Route/Hero" // Certifique-se que este caminho e arquivo existem e exportam corretamente

type Props = {}

const Page: React.FC<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(0)
  const [route, setRoute] = useState("Login")

  // Para garantir, vamos verificar se os componentes importados existem e são válidos.
  // Se houver dúvida, você pode comentá-los temporariamente para testar.
  if (!Heading || !Header || !Hero) {
    // Isso é mais para depuração local, não vai parar um erro de build se o módulo não for encontrado.
    console.error("Um ou mais componentes principais (Heading, Header, Hero) não foram carregados.")
    // Poderia retornar um fallback simples aqui se estivéssemos no lado do cliente e algo falhasse no carregamento dinâmico,
    // mas para erros de build/importação, o build falharia antes.
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
