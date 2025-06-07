import Link from "next/link";
import React from "react"

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Cursos",
    url: "/cursos",
  },
  {
    name: "Nós",
    url: "/nos",
  },
  {
    name: "Política",
    url: "/politica",
  },
  {
    name: "FAQ",
    url: "/faq",
  }
]

type Props = {
  activeItem: number;
  isMobile: boolean;
}

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {
          navItemsData && navItemsData.map((i, index) => (
            <Link href={`${i.url}`} key={index} passHref>
              <span
                className={`${activeItem === index
                  ? "dark:text-[#8C52FF] text-[#FF914D]"
                  : "dark:text-white text-black"
                  } text-[18px] px-6 font-Poppins font-[400]`}
              >
                {i.name}
              </span>
            </Link>
          ))
        }
      </div>
      {
        isMobile && (
          <div className="800px:hidden mt-5">
            {
              navItemsData && navItemsData.map((i, index) => (
                <Link href="/" key={index} passHref>
                  <span
                    className={`${activeItem === index
                      ? "dark:text-[#37A39A] text-[crimson]"
                      : "dark:text-white text-black"
                      } block py-5 text-[18px] px-6 font-Poppins font-[400]`}
                  >
                    {i.name}
                  </span>
                </Link>
              ))
            }
          </div>
        )
      }
    </>
  )
}

export default NavItems