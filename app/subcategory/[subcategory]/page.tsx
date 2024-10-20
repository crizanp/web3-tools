import { posts } from '../../../lib/data'; // Import your posts data
import { notFound } from 'next/navigation';
import React from 'react';

export default function SubcategoryPage({ params }) {
  const { subcategory } = params;

  // Decode the subcategory (to handle spaces and special characters)
  const decodedSubcategory = decodeURIComponent(subcategory);

  // Filter posts by subcategory
  const filteredPosts = posts.filter((post) => post.subcategory.toLowerCase() === decodedSubcategory.toLowerCase());

  if (filteredPosts.length === 0) {
    return <div className="p-10 text-center">No posts found for this subcategory.</div>;
  }

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10">
        {decodedSubcategory.charAt(0).toUpperCase() + decodedSubcategory.slice(1)} Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white p-8 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content.slice(0, 100)}...</p>
            <a href={`/blog/${post.slug}`} className="text-blue-500 hover:underline">
              Read more
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
