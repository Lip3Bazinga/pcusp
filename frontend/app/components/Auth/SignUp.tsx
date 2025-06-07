"use client"

import React, { FC, useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { styles } from "../../styles/styles"
import { FcGoogle } from "react-icons/fc"
import { useRegisterMutation } from "@/redux/features/auth/authApi"
import toast from "react-hot-toast"

type Props = {
  setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Por favor entre com seu nome!"),
  email: Yup.string().email("Email inválido!").required("Por favor entre com o seu email!"),
  password: Yup.string().required("Por favor entre com a sua senha!").min(6),
})

const SignUp: FC<Props> = ({ setRoute }) => {
  const [show, setShow] = useState(false)
  const [register, { data, error, isSuccess }] = useRegisterMutation()

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration Successful"
      toast.success(message)
      setRoute("Verification")
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any
        toast.error(errorData.data.message)
      }
    }
  }, [isSuccess, error])

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      const data = {
        name, email, password
      }

      await register(data)

      // setRoute("Verification")
    }
  })

  const { errors, touched, values, handleChange, handleSubmit } = formik

  return (
    <div className="w-full ">
      <h1 className={`${styles.title}`}>
        Junte-se ao PC Academy
      </h1>
      <form onSubmit={handleSubmit}>

        <div className="w-full mt-5 relative mb-3">
          <label className={`${styles.label}`} htmlFor="name">Entre com o seu nome</label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            id="name"
            placeholder="Tim Berners-Lee"
            className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`}
          />
          {errors.name && touched.name && (
            <span className="text-red-500 pt-2 block">{errors.name}</span>
          )}
        </div>

        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="email">Entre com o seu email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="loginmail@gmail.com"
            className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 pt-2 block">{errors.email}</span>
          )}
        </div>

        <div className="w-full mt-5 relative mb-1">
          <label className={`${styles.label}`} htmlFor="password">Entre com a sua senha</label>
          <input
            type={show ? "text" : "password"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="*********"
            className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer transition-colors duration-300 ease-in-out hover:fill-[#FF914D]"
              size={20}
              fill="white"
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer transition-colors duration-300 ease-in-out hover:fill-[#FF914D]"
              size={20}
              fill="white"
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500 pt-2 block">{errors.password}</span>
        )}
        <div className="w-full mt-5">
          <input type="submit" value="Criar conta" className={`${styles.button}`} />
        </div>

        <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">Ou entre com</h5>

        <div className="flex items-center justify-center my-3">
          <FcGoogle size={30} className="cursor-pointer mr-2" />
          <AiFillGithub size={30} className="cursor-pointer ml-2" />
        </div>

        <div className="text-center pt-4 font-Poppins text-[14px] text-white">
          Já possui uma conta?{" "}
          <span
            className="text-[#FF914D] pl-1 cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Entrar
          </span>
        </div>

      </form>
    </div>
  )
}

export default SignUp
