import connectToDatabase from "@/libs/mongodb";
import Blog from "@/models/blog";
import mongoose from "mongoose";

export default async function BlogDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <p className="text-center mt-8">Invalid blog ID</p>;
  }

  const blog = await Blog.findById(id).lean();

  if (!blog) {
    return <p className="text-center mt-8">Blog not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-0">
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full rounded-xl h-64 sm:h-80 md:h-96 object-cover shadow-md"
        />
      )}

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 text-gray-900">
        {blog.title}
      </h1>

      <p className="text-xs sm:text-sm text-gray-500 mt-2">
        By <span className="font-medium">{blog.author}</span> • {blog.date}
      </p>

      {blog.desc && (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 italic">
          {blog.desc}
        </p>
      )}

      <p className="mt-6 text-sm sm:text-base md:text-lg text-gray-700 whitespace-pre-line leading-relaxed">
        {blog.content}
      </p>
    </div>
  );
}
