import type React from "react"
import "./globals.css"
// import type { Metadata } from 'next';
import { Poppins, Josefin_Sans } from "next/font/google"
import ClientLayoutWrapper from "./client-layout-wrapper"
import { ThemeProvider } from "./utils/ThemeProvider"
import { Toaster } from "react-hot-toast"
import { Providers } from "./Provider"
import { SessionProvider } from "next-auth/react"
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
})

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        suppressHydrationWarning={true}
        className={`
        ${poppins.variable} ${josefin.variable} 
        antialiased !bg-white 
        duration-300
        bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black
      `}
      >
        <ClientLayoutWrapper>
          <Providers>
            <SessionProvider>
              <ThemeProvider>
                {children}
                <Toaster position="top-center" reverseOrder={false} />
              </ThemeProvider>
            </SessionProvider>
          </Providers>
        </ClientLayoutWrapper>
      </body>
    </html>
  )
}
