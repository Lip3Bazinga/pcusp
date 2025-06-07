import Link from "next/link"
import Image from "next/image"
// import TypingEffect from '@/app/utils/TypingEffect'; // Supondo que este componente exista

type Props = {}

const Hero = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="lg:w-[60%]">
        <Image
          src={"/assets/banner-img-1.png"} // Substitua pelo caminho correto da sua imagem
          width={600}
          height={600}
          alt="Hero Banner"
          className="object-contain mx-auto mb-8"
        />
        <h1 className="dark:text-white text-black text-3xl md:text-5xl font-extrabold font-Poppins leading-tight">
          Melhore sua experiência de aprendizado online com a <span className="text-gradient">LMS Platform</span>
        </h1>
        <br />
        {/* <div className="w-full text-center">
          <TypingEffect
            words={['Cursos de Desenvolvimento Web.', 'Cursos de Programação.', 'Cursos de Design.']}
          />
        </div> */}
        <br />
        <br />
        <div className="lg:w-[70%] w-[90%] m-auto">
          <p className="dark:text-[#edfff4] text-[#000000ac] font-Poppins font-[600] text-lg md:text-xl">
            Temos mais de 200.000+ Cursos Online e mais de 500.000+ Usuários Registrados. Encontre o curso dos seus
            sonhos aqui!
          </p>
          <br />
          <br />
          <div className="w-full text-center">
            <Link href="/courses">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105">
                Ver Cursos
              </button>
            </Link>
          </div>
          <br />
        </div>
      </div>
    </div>
  )
}

export default Hero
