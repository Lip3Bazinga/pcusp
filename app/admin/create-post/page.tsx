"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("Equipe Pensamento Computacional") // Default author
  const [tags, setTags] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    const postData = {
      title,
      excerpt,
      content,
      author,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag), // Split tags by comma and trim
      coverImage: coverImage || undefined, // Send undefined if empty, so it's not stored as empty string
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || `Error: ${res.status} ${res.statusText}`)
      }

      setSuccessMessage(`Post "${result.data.title}" criado com sucesso! Redirecionando...`)
      // Clear form
      setTitle("")
      setExcerpt("")
      setContent("")
      setAuthor("Equipe Pensamento Computacional")
      setTags("")
      setCoverImage("")

      // Redirect to the new post or blog page after a short delay
      setTimeout(() => {
        router.push(`/blog/${result.data.slug}`)
        router.refresh() // Refresh server components on the new page
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href="/blog" className="inline-flex items-center text-usp-blue hover:underline mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Voltar para o Blog
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-usp-blue">Criar Novo Post</CardTitle>
          <CardDescription>Preencha os campos abaixo para adicionar um novo artigo ao blog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="excerpt">Resumo (Excerpt)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="content">Conteúdo Completo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="mt-1"
                rows={10}
              />
            </div>
            <div>
              <Label htmlFor="author">Autor</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-1"
                placeholder="ex: introdução, algoritmos, usp"
              />
            </div>
            <div>
              <Label htmlFor="coverImage">URL da Imagem de Capa (Opcional)</Label>
              <Input
                id="coverImage"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="mt-1"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            {successMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
            <Button type="submit" disabled={isLoading} className="w-full bg-usp-blue hover:bg-usp-blue/90">
              {isLoading ? "Criando Post..." : "Criar Post"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            O slug do post será gerado automaticamente a partir do título.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
