import Link from "next/link"
import PostCard from "@/components/blog/post-card"
import type { IPost } from "@/lib/models/post.model"

// Function to get the base URL for API calls
// In Next.js, process.env.VERCEL_URL or NEXT_PUBLIC_APP_URL might not be set up for self-referential fetches.
// Using relative paths for API calls from Server Components is generally fine.
function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side
    return "" // Relative path from client
  }
  // Server-side
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Fallback for local development (adjust port if necessary)
  return "http://localhost:3000"
}

async function getPosts(): Promise<IPost[]> {
  const apiUrl = `${getApiBaseUrl()}/api/posts`
  try {
    // Using { cache: 'no-store' } to ensure fresh data on each request for dynamic content.
    // For a blog, you might want 'force-cache' or revalidate options for better performance.
    const res = await fetch(apiUrl, { cache: "no-store" })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`Failed to fetch posts from ${apiUrl}. Status: ${res.status}. Body: ${errorBody}`)
      // Return empty array or throw error based on how you want to handle this
      return []
    }

    const responseJson = await res.json()
    if (responseJson.success && Array.isArray(responseJson.data)) {
      return responseJson.data
    } else {
      console.error("API response was successful but data is not in expected format:", responseJson)
      return []
    }
  } catch (error) {
    console.error(`Error fetching posts from ${apiUrl}:`, error)
    return [] // Fallback to empty array on network error or JSON parsing error
  }
}

export default async function BlogPage() {
  const posts = await getPosts()

  if (!posts || posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        Nenhum post encontrado. Que tal{" "}
        <Link href="/admin/create-post" className="text-usp-blue hover:underline">
          criar o primeiro
        </Link>
        ?
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        // Ensure post._id is available and used as key if slug might not be unique before saving
        <PostCard key={post._id || post.slug} post={post} />
      ))}
    </div>
  )
}
