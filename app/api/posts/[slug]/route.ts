import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import PostModel, { type IPost } from "@/lib/models/post.model"
import mongoose from "mongoose"

interface Params {
  slug: string
}

export async function GET(request: Request, { params }: { params: Params }) {
  await dbConnect()
  try {
    const post = await PostModel.findOne({ slug: params.slug })
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    console.error(`Error in GET /api/posts/${params.slug}:`, error)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  await dbConnect()
  try {
    const body = (await request.json()) as Partial<IPost>
    // If title is updated, slug should ideally be updated too, or handled carefully
    // For simplicity, this example doesn't auto-update slug on title change via PUT
    // You might want to add logic for that if needed, or disallow slug changes.
    const updatedPost = await PostModel.findOneAndUpdate({ slug: params.slug }, body, {
      new: true,
      runValidators: true,
    })
    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updatedPost })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    console.error(`Error in PUT /api/posts/${params.slug}:`, error)
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ success: false, error: errorMessage, details: (error as any).errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  await dbConnect()
  try {
    const deletedPost = await PostModel.findOneAndDelete({ slug: params.slug })
    if (!deletedPost) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: {} }) // Successfully deleted, no content to return
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    console.error(`Error in DELETE /api/posts/${params.slug}:`, error)
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
