import mongoose, { Schema, type Document, models, type Model } from "mongoose"

export interface IPost extends Document {
  _id: string // Ensure _id is part of the interface if you use it directly
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage?: string // Make coverImage optional if it can be empty
  author: string
  publishedAt: Date
  tags?: string[] // Make tags optional
}

const PostSchema: Schema<IPost> = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String, required: false },
    author: { type: String, required: true, default: "Pensamento Computacional Team" },
    publishedAt: { type: Date, default: Date.now },
    tags: [{ type: String }],
  },
  { timestamps: true },
)

PostSchema.pre<IPost>("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = (this.title || "") // Add null check for title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word, non-space, non-hyphen characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
  }
  next()
})

const PostModel: Model<IPost> = models.Post || mongoose.model<IPost>("Post", PostSchema)

export default PostModel
