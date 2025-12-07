"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    userEmail: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (!form.name || form.name == "") {
      toast.error("Please enter your name", { position: "top-right" });
      return
    }
    if (!form.userEmail || form.userEmail == "") {
      toast.error("Please enter your email", { position: "top-right" });
      return
    }
    if (!form.password || form.password == "") {
      toast.error("Please enter your password", { position: "top-right" });
      return
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: form.userEmail.toLocaleLowerCase(),
          password: form.password,
          name: form.name
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registered Successfully!", { position: "top-right" });
        setTimeout(() => router.push("/login"), 1500); // redirect after toast
      } else {
        toast.error(data.message || "Error registering", {
          position: "top-right",
        });
      }
      setLoading(false)
    } catch (err) {
      toast.error("Something went wrong", { position: "top-right" });
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pt-20">
      <form
        onSubmit={handleSubmit}
        className="w-96 p-8 bg-white/80 backdrop-blur-lg shadow-xl border border-white/20 rounded-2xl flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none"
          value={form.userEmail}
          onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-orange-400 outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl shadow transition font-semibold cursor-pointer">
         {loading ? "Registering..." : "Register"}
        </button>

        <p
          onClick={() => router.push("/login")}
          className="text-orange-600 cursor-pointer text-center hover:underline"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
