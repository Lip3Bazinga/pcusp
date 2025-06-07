"use client"

import type React from "react" // Importação de React pode ser necessária para FC

import Image from "next/image"
import { styles } from "../../../app/styles/styles"
import { type FC, useEffect, useState } from "react"
import { AiOutlineCamera } from "react-icons/ai"
import avatarIcon from "../../../public/assets/avatar.png"
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi"
import { useLoadUserQuery } from "@/redux/features/api/apiSlice"
import toast from "react-hot-toast"

type Props = {
  avatar: string | null
  user: any
}

const ProfileInfo: FC<Props> = ({ avatar: propAvatar, user }) => {
  const [name, setName] = useState(user && user.name)
  const [updateAvatar, { isSuccess, error: updateAvatarError }] = useUpdateAvatarMutation()
  const [loadUserTrigger, setLoadUserTrigger] = useState(false)

  // A desestruturação vazia {} = useLoadUserQuery(...) estava causando "Unexpected empty object pattern".
  // Se você não precisa dos resultados da query diretamente neste componente, pode apenas chamar o hook.
  useLoadUserQuery(undefined, { skip: !loadUserTrigger })

  const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Tipado 'e'
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          const avatarResult = fileReader.result
          updateAvatar(avatarResult)
        }
      }
      fileReader.readAsDataURL(e.target.files[0])
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setLoadUserTrigger(true)
      toast.success("Avatar atualizado com sucesso!")
    }
    if (updateAvatarError) {
      console.log(updateAvatarError)
      toast.error("Falha ao atualizar avatar.")
    }
  }, [isSuccess, updateAvatarError])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submit com nome:", name)
    // Lógica para atualizar o nome do usuário
    toast.success("Informações do perfil salvas (simulado).")
  }

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar?.url || propAvatar || avatarIcon}
            alt="User avatar"
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[primary] rounded-full object-cover"
          />
          <input
            type="file"
            name="avatar-upload"
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
              <AiOutlineCamera size={20} className="z-1 text-white" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2 dark:text-white text-black">Nome Completo</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2 dark:text-white text-black">Email</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0 bg-gray-100 dark:bg-gray-700 cursor-not-allowed`}
                required
                value={user?.email}
              />
            </div>
            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37A39A] text-center dark:text-[#FFF] text-black rounded-[3px] mt-8 cursor-pointer hover:bg-[#37A39A] hover:text-white transition-colors duration-200`}
              required
              value="Atualizar Perfil"
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default ProfileInfo
