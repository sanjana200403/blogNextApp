"use client";

import CreatePostModal from "@/components/CreatePostModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(`/api/blogs/user/${user.userEmail}`);
      const data = await res.json();
      setBlogs(data.blogs || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please login to access your blogs", { position: "top-right" });
      router.push("/login");
      return;
    }

    fetchBlogs();
  }, [router]);

  const handleEdit = (blog: any) => {
    setSelectedBlog(blog);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBlog(null);
    fetchBlogs(); // refresh blogs after update
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Delete blog?")) return;
    try {
      const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted successfully!", { position: "top-right" });
        fetchBlogs();
      } else {
        toast.error("Failed to delete blog", { position: "top-right" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { position: "top-right" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 sm:py-10">
        {/* Heading */}
        <h2 className="text-2xl py-4 sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-10 text-center from-orange-600 to-pink-500 ">
          My Blogs
        </h2>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 mt-20 text-base sm:text-lg">
          Loading blogs...
        </div>
      )}

      {/* No blogs */}
      {!loading && blogs.length === 0 && (
        <div className="text-center mt-20 text-gray-500 text-base sm:text-lg">
          <p>No blogs found.</p>
        </div>
      )}

      {/* Blog Cards */}
      <div className="max-w-5xl mx-auto space-y-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orange-200 p-4 flex flex-col sm:flex-row gap-4 sm:gap-6"
          >
            {/* Image */}
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full sm:w-40 h-40 rounded-xl object-cover  border"
            />

            {/* Content */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {blog.title}
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  <p>📅 {blog.date}</p>
                  <p>✍️ {blog.author}</p>
                </div>
                <p className="mt-2 sm:mt-3 text-gray-700 line-clamp-3 text-sm sm:text-base">
                  {blog.desc}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
                <button
                  onClick={() => router.push(`/blog/${blog._id}`)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition flex-1 text-center text-sm sm:text-base cursor-pointer"
                >
                  Read More
                </button>

                <button
                  onClick={() => handleEdit(blog)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition flex-1 text-center text-sm sm:text-base cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition flex-1 text-center text-sm sm:text-base cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

        {/* Modal */}
        <CreatePostModal
          open={openModal}
          onClose={handleCloseModal}
          blog={selectedBlog}
        />
      </div>
    </>
  );
}
