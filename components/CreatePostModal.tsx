"use client";

import { GoogleGenAI } from "@google/genai";
import { useState, useEffect } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { toast } from "react-toastify";

interface Blog {
  _id?: string;
  status: "published" | "draft";
  image?: string;
  title: string;
  desc: string;
  author?: string;
  date?: string;
  content?: string;
 excerpt?: string
}

interface Props {
  open: boolean;
  onClose: () => void;
  blog?: Blog | null;
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

export default function CreatePostModal({ open, onClose, blog }: Props) {
  if (!open) return null;

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [loading, setLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (blog) {
      setImage(blog.image || "");
      setTitle(blog.title || "");
      setAuthor(blog.author || user?.userEmail || "");
      setExcerpt(blog.desc || "");
      setContent(blog.content || "");
      setStatus(blog.status || "draft");
    } else {
      setImage("");
      setTitle("");
      setAuthor(user?.userEmail || "");
      setExcerpt("");
      setContent("");
      setStatus("draft");
    }
  }, [blog]);

  const generateFullPostByAI = async () => {
    setLoading(true);
    try {
      const prompt = `
        Generate a full blog post.
        Include:
        - Title
        - Short excerpt (2-3 lines)
        - Content (3-5 paragraphs)
        Topic: Technology.
        Return as plain text in this format:
        Title: ...
        Excerpt: ...
        Content: ...
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const generatedText = response.text || "";

      // Parse plain text into title, excerpt, content
      const titleMatch = generatedText.match(/Title:\s*(.*)/i);
      const excerptMatch = generatedText.match(/Excerpt:\s*(.*)/i);
      const contentMatch = generatedText.match(/Content:\s*([\s\S]*)/i);

      setTitle(titleMatch?.[1]?.trim() || "AI Generated Title");
      setExcerpt(excerptMatch?.[1]?.trim() || "AI Generated Excerpt");
      setContent(contentMatch?.[1]?.trim() || "AI Generated Content");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate blog post")
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Title is required", { position: "top-right" });
      return;
    }

    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters long", { position: "top-right" });
      return;
    }

    if (!author.trim()) {
      toast.error("Author email is required", { position: "top-right" });
      return;
    }

    if (!excerpt.trim()) {
      toast.error("Excerpt is required", { position: "top-right" });
      return;
    }

    if (excerpt.trim().length < 10) {
      toast.error("Excerpt must be at least 10 characters long", { position: "top-right" });
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required", { position: "top-right" });
      return;
    }

    if (content.trim().length < 50) {
      toast.error("Content must be at least 50 characters long", { position: "top-right" });
      return;
    }

    // Validate image URL if provided
    if (image.trim()) {
      if (!image) {
        toast.error("Please enter a image URL", { position: "top-right" });
        return;
      }
    }

    setLoading(true);
    const payload = {
      status,
      image: image.trim(),
      title: title.trim(),
      desc: excerpt.trim(),
      author: author.trim(),
      date: new Date().toDateString(),
      content: content.trim(),
    };

    try {
      let res;
      if (blog?._id) {
        res = await fetch(`/api/blogs/${blog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      toast.success(blog?._id ? "Blog updated successfully!" : "Blog created successfully!", { position: "top-right" })
      onClose();
    } catch (err: any) {
      toast.error(err.message || "An error occurred", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
      <div className="bg-white w-full max-w-[650px] max-h-[90vh] overflow-y-auto rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 relative">
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-black cursor-pointer">
          <FiX size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-6 pr-8 sm:pr-0">
          <h2 className="text-xl sm:text-2xl font-semibold">{blog ? "Edit Post" : "Create New Post"}</h2>
          <button
            onClick={generateFullPostByAI}
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-blue-600 transition whitespace-nowrap cursor-pointer"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate by AI"}
          </button>
        </div>

        {/* Image Box */}
        <div className="w-full border border-gray-300 bg-gray-100 rounded-lg sm:rounded-xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-10">
          <FiImage size={32} className="sm:w-[40px] sm:h-[40px]" />
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full mt-3 p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-gray-50 text-sm sm:text-base"
          />
        </div>

        {/* Title + Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-5">
          <div>
            <label className="text-xs sm:text-sm font-medium block mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-gray-50 text-sm sm:text-base"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-medium block mb-1">
              Author Email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-gray-50 text-sm sm:text-base"
              disabled={!!user?.userEmail}
              placeholder="Author name"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="mt-4 sm:mt-5">
          <label className="text-xs sm:text-sm font-medium block mb-1">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-gray-50 text-sm sm:text-base resize-none"
            placeholder="Brief description (min 10 characters)"
          />
        </div>

        {/* Content */}
        <div className="mt-4 sm:mt-5">
          <label className="text-xs sm:text-sm font-medium block mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-gray-50 text-sm sm:text-base resize-none"
            placeholder="Write your blog content (min 50 characters)"
          />
        </div>

        {/* Status */}
        <div className="mt-4 sm:mt-5">
          <label className="text-xs sm:text-sm font-medium block mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft")}
            className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl bg-gray-50 text-sm sm:text-base"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 sm:mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow disabled:opacity-50 font-medium text-sm sm:text-base cursor-pointer"
        >
          {loading ? "Saving..." : blog ? "Save Changes" : "Publish Post"}
        </button>
      </div>
    </div>
  );
}
