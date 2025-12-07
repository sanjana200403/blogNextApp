"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userEmail: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validation
    if (!form.userEmail?.trim()) {
      toast.error("Email is required", { position: "top-right" });
      return;
    }
    if (!form.password?.trim()) {
      toast.error("Password is required", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: form.userEmail.toLowerCase().trim(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Dispatch event to notify Navbar
        window.dispatchEvent(new Event("authChange"));
        toast.success("Login successful!", { position: "top-right" });
        setTimeout(() => router.push("/"), 1500);
      } else {
        // Handle specific error messages
        toast.error(data.message || "Login failed", { position: "top-right" });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 sm:p-8 bg-white/80 backdrop-blur-lg shadow-xl border border-white/20 rounded-2xl flex flex-col gap-5"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none text-sm sm:text-base"
          value={form.userEmail}
          onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none text-sm sm:text-base"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl shadow transition font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          onClick={() => router.push("/register")}
          className="text-orange-600 cursor-pointer text-center hover:underline text-sm sm:text-base"
        >
          Don't have an account? Register
        </p>
      </form>

      <ToastContainer />
    </div>
  );
}
