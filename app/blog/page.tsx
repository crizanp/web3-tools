"use client";

import { useState } from 'react';
import Link from 'next/link';
import { posts } from '../../lib/data';

// Helper function to extract unique categories
const getUniqueCategories = () => {
  const categories = posts.map((post) => post.category);
  return ['All', ...new Set(categories)];
};

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = getUniqueCategories();

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <main className="p-10">
      {/* <h1 className="text-4xl font-bold mb-5 text-center">Latest Blog Posts</h1> */}

      {/* Tab-based category filter */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex border-b-2 border-gray-300">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 text-lg font-semibold focus:outline-none ${
                selectedCategory === category
                  ? 'border-b-4 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-gray-100 p-5 rounded shadow-md">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
              Learn More
            </Link>
          </div>
        ))}
      </div>

      {/* No Posts Found Message */}
      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No posts found in this category.</p>
      )}
    </main>
  );
}
