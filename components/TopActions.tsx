import { FiSearch, FiPlus, FiInfo } from "react-icons/fi";

export default function TopActions({
  onCreate,
  onSearch,
}: {
  onCreate: () => void;
  onSearch: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        {/* Search Bar */}
        <div className="relative w-full sm:w-[420px]">
          <div className="absolute left-4 top-3.5 text-gray-400">
            <FiSearch size={18} />
          </div>
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white
                       border border-gray-200 shadow-sm
                       text-gray-700 placeholder-gray-400
                       focus:ring-2 focus:ring-orange-500 focus:outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">

          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-orange-600 text-white
                       py-2.5 px-5 rounded-xl shadow-sm
                       hover:bg-orange-700 transition w-full sm:w-auto justify-center cursor-pointer"
          >
            <FiPlus size={18} />
            Create New Blog
          </button>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
        <FiInfo size={18} className="mt-0.5 flex-shrink-0" />
        <p>
          <span className="font-medium">Note:</span> You need to login to edit and delete your blogs.
        </p>
      </div>
    </div>
  );
}
