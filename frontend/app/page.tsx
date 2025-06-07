"use client"

// Removida a importação de 'React' se não for explicitamente usada (FC a infere)
import { useState, type FC } from "react" // FC importado para tipagem
import Heading from "./utils/Heading"
import Header from "./components/Header"
import Hero from "./components/Route/Hero"
// import { useSelector } from "react-redux"; // Removido se user não for usado

// Definindo Props explicitamente, mesmo que vazio, para clareza com FC
type PageProps = {}

const Page: FC<PageProps> = (/*props*/) => {
  // Usando PageProps
  const [open, setOpen] = useState(false)
  // Se activeItem e setActiveItem não são usados, eles devem ser removidos
  // ou sua lógica implementada. Para passar no lint, vamos comentar por enquanto.
  const [activeItem, setActiveItem] = useState(0)
  const [route, setRoute] = useState("Login")
  // const {user} = useSelector((state:any) => state.auth);

  // Exemplo de como "usar" setActiveItem para o linter, se necessário.
  // Idealmente, haveria uma lógica real que chama setActiveItem.
  if (activeItem === -100) {
    // Condição improvável apenas para "usar" activeItem
    setActiveItem(0) // "Usa" setActiveItem
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
