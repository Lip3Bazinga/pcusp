import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, UserCircle, ArrowLeft } from "lucide-react"
import type { IPost } from "@/lib/models/post.model"
import { notFound } from "next/navigation"
import Link from "next/link"

interface PostPageProps {
  params: {
    slug: string
  }
}

// Function to get the base URL for API calls
function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    return ""
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

async function getPost(slug: string): Promise<IPost | null> {
  const apiUrl = `${getApiBaseUrl()}/api/posts/${slug}`
  try {
    const res = await fetch(apiUrl, { cache: "no-store" }) // Or other caching strategy

    if (!res.ok) {
      if (res.status === 404) {
        return null // Post not found
      }
      const errorBody = await res.text()
      console.error(`Failed to fetch post ${slug} from ${apiUrl}. Status: ${res.status}. Body: ${errorBody}`)
      // Depending on requirements, you might throw an error or return null
      // For notFound() to work correctly, returning null is appropriate here.
      return null
    }

    const responseJson = await res.json()
    if (responseJson.success && responseJson.data) {
      return responseJson.data
    } else {
      console.error(`API response for post ${slug} was successful but data is not in expected format:`, responseJson)
      return null
    }
  } catch (error) {
    console.error(`Error fetching post ${slug} from ${apiUrl}:`, error)
    return null
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound() // This will render the nearest not-found.tsx page or a default Next.js 404 page
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/blog" className="inline-flex items-center text-usp-blue hover:underline mb-6 group">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Voltar para todos os posts
      </Link>
      <article className="prose lg:prose-xl dark:prose-invert max-w-none">
        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden not-prose">
            <Image
              src={
                post.coverImage || `/placeholder.svg?width=1200&height=675&query=post+${encodeURIComponent(post.title)}`
              }
              alt={post.title}
              fill
              className="object-cover"
              priority // Priority for LCP on post page
            />
          </div>
        )}
        <h1 className="text-usp-blue !mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center space-x-4 text-base text-muted-foreground mb-4 not-prose">
          <div className="flex items-center">
            <UserCircle className="w-5 h-5 mr-2" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>{formattedDate}</span>
          </div>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 not-prose">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Render post content. Assuming simple text for now. For Markdown, use a renderer. */}
        <div className="text-foreground">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}

// Optional: Generate static params if your posts don't change often
// export async function generateStaticParams() {
//   const apiUrl = `${getApiBaseUrl()}/api/posts`;
//   const res = await fetch(apiUrl);
//   const result = await res.json();
//   const posts: IPost[] = result.data || [];
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
