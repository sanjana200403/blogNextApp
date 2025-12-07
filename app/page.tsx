"use client";

import BlogCard from "@/components/BlogCard";
import CreatePostModal from "@/components/CreatePostModal";
import TopActions from "@/components/TopActions";
import { useState, useEffect } from "react";

interface Blog {
  _id: string;
  status: "published" | "draft";
  image: string;
  title: string;
  desc: string;
  author: string;
  date: string;
  content?: string;
}

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  // DELETE Blog
  async function deleteBlog(id: string) {
    if (!confirm("Delete blog?")) return;

    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) fetchBlogs();
  }

  // FETCH Blogs
  const fetchBlogs = async () => {
    setLoading(true);
    const res = await fetch("/api/blogs");
    const data = await res.json();
    setBlogs(data);
    setFilteredBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // SEARCH Filter
  const handleSearch = (value: string) => {
    const t = value.toLowerCase().trim();

    const result = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(t) ||
        b.desc.toLowerCase().includes(t) ||
        b.author.toLowerCase().includes(t)
    );

    setFilteredBlogs(result);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 min-h-screen">

      {/* EXACT TOP BAR */}
      <TopActions onCreate={() => {
        setEditingBlog(null);
        setOpenModal(true);
      }} onSearch={handleSearch} />

      {/* Blog Cards */}
      <div className="mt-10 flex gap-8 justify-center flex-wrap">
        {loading ? (
          <p>Loading blogs...</p>
        ) : filteredBlogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          filteredBlogs.map((b) => (
            <BlogCard
              key={b._id}
              {...b}
              onEdit={() => {
                setEditingBlog(b);
                setOpenModal(true);
              }}
              onDelete={() => deleteBlog(b._id)}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <CreatePostModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          fetchBlogs();
        }}
        blog={editingBlog}
      />
    </div>
  );
}
