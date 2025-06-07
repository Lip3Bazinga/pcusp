import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-usp-blue">Blog Pensamento Computacional</h1>
            <p className="text-lg sm:text-xl text-muted-foreground mt-2">
              Novidades, artigos e tutoriais sobre o universo da computação.
            </p>
          </div>
          <Link href="/admin/create-post" passHref>
            <Button className="bg-usp-blue hover:bg-usp-blue/90 text-white">Criar Novo Post</Button>
          </Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} Plataforma Pensamento Computacional - USP. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
