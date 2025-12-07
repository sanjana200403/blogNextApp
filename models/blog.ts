// models/Blog.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for Blog
export interface IBlog extends Document {
  status: "published" | "draft";
  title: string;
  content: string;
  desc: string;
  image: string;
  author: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const BlogSchema: Schema<IBlog> = new Schema(
  {
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Avoid recompiling model during hot reloads in development
const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
