export default function SearchBar() {
  return (
    <div className="w-full  mt-6 flex justify-between">
      <input
        type="text"
        placeholder="Search posts..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 
                   focus:ring-orange-400 outline-none"
      />
       <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 cursor-pointer">
          + Create New Blog
        </button>
    </div>
  );
}
