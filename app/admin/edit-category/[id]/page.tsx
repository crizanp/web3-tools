"use client";  // Add this to make the component a Client Component

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function EditCategory() {
  const { id } = useParams();  // Get the ID from the URL params
  const router = useRouter();   // Use useRouter for navigation after form submission
  const [category, setCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    if (id) {
      async function fetchCategory() {
        const token = Cookies.get('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setCategory(data);
      }

      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });

    if (res.ok) {
      router.push('/admin');  // Redirect to the admin page after successful edit
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Category</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 shadow-md rounded-md">
        <div className="mb-4">
          <label className="block text-gray-700">Category Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={category.description}
            onChange={(e) => setCategory({ ...category, description: e.target.value })}
            required
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Save Changes</button>
      </form>
    </div>
  );
}
