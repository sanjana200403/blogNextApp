"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiUser, FiLogOut, FiFileText } from "react-icons/fi";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check user on mount
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    // Listen for auth changes
    const handleAuthChange = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("authChange"));
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm shadow-gray-200/40">
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-orange-600 tracking-tight">
          BlogManager
        </Link>

        {/* Right Section */}
        {user ? (
          <div className="relative">
            
            {/* Profile Circle */}
            <div
              onClick={() => setOpen(!open)}
              className="w-10 h-10 rounded-full bg-orange-600 text-white 
                         flex items-center justify-center cursor-pointer 
                         hover:bg-orange-700 transition"
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 
                           shadow-xl shadow-gray-300/30 rounded-xl 
                           overflow-hidden animate-fadeIn z-50"
              >
                <Link
                  href="/myblogs"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-gray-700"
                >
                  <FiFileText /> My Blogs
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 
                             hover:bg-gray-100 text-red-600"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 bg-orange-600 text-white rounded-xl shadow 
                       hover:bg-orange-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
