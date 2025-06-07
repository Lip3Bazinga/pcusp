import React, { FC } from "react"
import Image from "next/image"
import { BiSearch } from "react-icons/bi"
import BannerImage from "../../../public/assets/banner-img-1.png"
import Person1 from "../../../public/assets/person-1.jpg"
import Person2 from "../../../public/assets/person-2.jpg"
import Person3 from "../../../public/assets/person-3.jpg"

import TypingEffect from "../../utils/TypingEffect" // Importa o componente TypingEffect
import Link from "next/link"

const Hero: FC = () => {
  return (
    <div className="relative w-full h-[100vh] flex flex-col sm:flex-row items-center justify-between dark:hero-animation">
      <div className="flex items-center justify-center h-full w-full sm:w-1/2 relative">
        <div className="absolute top-[50px] sm:top-[unset] h-[30vh] w-[30vh] sm:h-[500px] sm:w-[500px] hero_animation rounded-full"></div>
        <Image
          src={BannerImage}
          alt="Banner Image"
          className="object-contain max-w-[350px] sm:max-w-[300px] h-auto mx-auto z-10"
        />
      </div>
      <div className="flex-1 flex flex-col items-start text-left p-5 z-10 w-full sm:w-1/2">
        <TypingEffect
          // gambiarra, não sei por quem, mas o efeito de typing só está funcionando corretamente quando adiciono 2 espaços no início da frase
          text="  Venha aprender a programar com a maior Universidade da América Latina"
          typingSpeed={100} // Ajuste a velocidade conforme necessário
        />
        <p className="pl-2 dark:text-[#EDFFF4] text-[#000000AC] font-semibold text-[16px] sm:text-[18px] max-w-lg mt-5">
          Nós temos <span className="text-[#FF914D] font-bold">155+</span> cursos & <span className="text-[#FF914D] font-bold">300+</span> Alunos. Procure o curso que mais faça sentido para você e <span className="text-[#FF914D] font-bold">estude de graça e pegue seu certificado ao final do curso</span>.
        </p>
        <div className="pl-2 relative w-full mt-5">
          <input
            type="search"
            placeholder="Pesquise um curso..."
            className="bg-transparent border border-[#1b1b1b] dark:border-none dark:bg-[#1D1D1D]
               placeholder:text-[#1b1b1b] dark:placeholder:text-[#FFFFFF]
               rounded-l-md p-2 w-full h-full outline-none text-[#1b1b1b]
               dark:text-[#FFFFFFE6] text-[16px] sm:text-[20px] font-medium"
          />
          <button className="absolute right-0 top-0 bg-[#8C52FF] border-none p-2 h-full hover:bg-[#FF914D] transition duration-200 outline-none">
            <BiSearch className="text-white" size={24} />
          </button>
        </div>
        <div className="w-full h-[50px] mt-5">
          <ul className="relative w-full h-full">
            <li className="absolute w-[50px] z-[1] h-full rounded-full border-4 border-[#8C52FF] ">
              <Image
                src={Person1}
                alt="Imagem de uma pessoa"
                width={50}
                height={50}
                className="rounded-full"
              />
            </li>
            <li className="absolute left-[25px] z-[2] w-[50px] h-full rounded-full border-4 border-[#8C52FF]">
              <Image
                src={Person2}
                alt="Imagem de uma pessoa"
                width={50}
                height={50}
                className="rounded-full"
              />
            </li>
            <li className="absolute left-[50px] z-[3] w-[50px] h-full rounded-full border-4 border-[#8C52FF]">
              <Image
                src={Person3}
                alt="Imagem de uma pessoa"
                width={50}
                height={50}
                className="rounded-full"
              />
            </li>
          </ul>
          <p className="mt-2 dark:text-white text-black">300+ Pessoas já confiaram em nós.
            <Link
              href="/courses"
              className="text-[#8C52FF] pl-2 font-[700]"
            >
              Ver os Cursos
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Hero;