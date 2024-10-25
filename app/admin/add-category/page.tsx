"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie to get the token

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get token from cookies
    const token = Cookies.get("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Add the token in the Authorization header
      },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      router.push("/admin"); // Redirect to admin dashboard after successful submission
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Category</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md">
        <div className="mb-4">
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}
