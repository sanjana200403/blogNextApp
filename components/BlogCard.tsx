

type BlogCardProps = {
  _id: string;
  status: "published" | "draft";
  image: string;
  title: string;
  desc: string;
  author: string;
  date: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BlogCard({
  _id,
  status,
  image,
  title,
  desc,
  author,
  date,
  onEdit,
  onDelete,
}: BlogCardProps) {
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const canEdit = user?.userEmail === author;

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden w-full sm:w-72 md:w-80 cursor-pointer flex flex-col"
      onClick={() => (window.location.href = `/blog/${_id}`)}
    >
      {/* Image */}
      <div className="relative">
        <img src={image} alt="blog" className="w-full h-44 object-cover" />
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-xs text-white rounded-full ${
            status === "published" ? "bg-green-600" : "bg-gray-600"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-xl font-semibold line-clamp-2">{title}</h2>

        <p
          className="text-gray-600 text-sm mt-2 flex-1 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {desc}
        </p>

        {/* author + date */}
        <div className="text-xs text-gray-500 mt-3">
          <p>
            By: <span className="font-medium">{author}</span>
          </p>
          <p>Posted: {date}</p>
        </div>

        {/* Edit/Delete buttons */}
        <div
          className="flex justify-between mt-5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            disabled={!canEdit}
            className={`border px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 ${
              !canEdit ? "opacity-40 cursor-not-allowed" : ""
            }`}
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            disabled={!canEdit}
            className={`border px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 ${
              !canEdit ? "opacity-40 cursor-not-allowed" : ""
            }`}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}



