import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, UserCircle } from "lucide-react"
import type { IPost } from "@/lib/models/post.model"

interface PostCardProps {
  post: Pick<IPost, "title" | "slug" | "excerpt" | "coverImage" | "author" | "publishedAt" | "tags">
}

export default function PostCard({ post }: PostCardProps) {
  const { title, slug, excerpt, coverImage, author, publishedAt, tags } = post
  const formattedDate = new Date(publishedAt).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
      <Link href={`/blog/${slug}`} className="block">
        <div className="relative w-full h-48 bg-muted">
          <Image
            src={coverImage || `/placeholder.svg?width=400&height=200&query=blog+post+${encodeURIComponent(title)}`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false} // Avoid too many priority images on a list page
          />
        </div>
      </Link>
      <CardHeader className="pb-2">
        <Link href={`/blog/${slug}`}>
          <CardTitle className="text-xl font-semibold text-usp-blue hover:underline">{title}</CardTitle>
        </Link>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
          <div className="flex items-center">
            <UserCircle className="w-4 h-4 mr-1" />
            <span>{author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{excerpt}</CardDescription>
      </CardContent>
      {tags && tags.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
