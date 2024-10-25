"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";  // Import cookies library

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // Store token in cookies instead of localStorage
      Cookies.set("token", data.token, { expires: 1 });  // Token expires in 1 day

      // Redirect to admin page
      router.push("/admin");
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md">
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
