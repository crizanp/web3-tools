"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categoriesError, setCategoriesError] = useState(null);
  const [postsError, setPostsError] = useState(null);

  // Retrieve the token from cookies
  const token = Cookies.get("token");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        setCategoriesError(error.message);
      }
    }

    async function fetchPosts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        setPostsError(error.message);
      }
    }

    fetchCategories();
    fetchPosts();
  }, [token]);

  return (
      <div className="container mx-auto mt-10 px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Admin Dashboard</h1>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Categories</h2>
          {categoriesError ? (
            <p className="text-red-500">Error: {categoriesError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-medium text-gray-800">{category.name}</h3>
                    <Link
                      href={`/admin/edit-category/${category._id}`}
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No categories available.</p>
              )}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Link
              href="/admin/add-category"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Add New Category
            </Link>
          </div>
        </div>

        {/* Posts Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Posts</h2>
          {postsError ? (
            <p className="text-red-500">Error: {postsError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
                    <Link
                      href={`/admin/edit-post/${post._id}`}
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No posts available.</p>
              )}
            </div>
          )}
          <div className="flex justify-center mt-8">
            <Link
              href="/admin/add-post"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Add New Post
            </Link>
          </div>
        </div>
      </div>
  );
}
