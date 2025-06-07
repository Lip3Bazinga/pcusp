import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import PostModel, { type IPost } from "@/lib/models/post.model"
import mongoose from "mongoose"

export async function GET() {
  await dbConnect()
  try {
    const posts = await PostModel.find({}).sort({ publishedAt: -1 })
    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    console.error("Error in GET /api/posts:", error)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()
  try {
    const body = (await request.json()) as Partial<IPost>

    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, content, excerpt" },
        { status: 400 },
      )
    }
    // Ensure author is set if not provided, or use a default
    if (!body.author) {
      body.author = "Equipe Pensamento Computacional"
    }

    const newPost = new PostModel(body)
    await newPost.save() // This will trigger the pre-save hook for slug generation

    return NextResponse.json({ success: true, data: newPost }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    console.error("Error in POST /api/posts:", error)
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ success: false, error: errorMessage, details: (error as any).errors }, { status: 400 })
    }
    if ((error as any).code === 11000) {
      // Duplicate key error (e.g. for slug)
      return NextResponse.json(
        { success: false, error: "A post with this title/slug already exists." },
        { status: 409 },
      )
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
