"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Spinner from '../components/Spinner';

// Define types for posts and categories
interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  slug: string;
  category: string;
}

interface Category {
  _id: string;
  name: string;
}

// Helper function to extract unique category names
const getUniqueCategories = (posts: Post[], categories: Category[]): string[] => {
  const categoryIds = posts.map((post) => post.category);
  const categoryNames = categoryIds.map((id) => categories.find((cat) => cat._id === id)?.name || 'Unknown');
  return ['All', ...new Set(categoryNames)];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsAndCategories = async () => {
      try {
        const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!postsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const postsData = await postsResponse.json();
        const categoriesData = await categoriesResponse.json();
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPostsAndCategories();
  }, []);

  const categoryList = getUniqueCategories(posts, categories);

  // Filter posts based on selected category
  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((post) =>
          categories.find((cat) => cat.name === selectedCategory && cat._id === post.category)
        );

  return (
    <main className="p-5 sm:p-8 lg:p-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
      <Spinner loading={loading} />

      {/* Error Message */}
      {error && (
        <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>
      )}

      {/* Tab-based category filter */}
      <div className="flex justify-center mb-6 lg:mb-10">
        <div className="inline-flex border-b-2 border-gray-300 dark:border-gray-700 overflow-x-auto">
          {categoryList.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-lg font-semibold focus:outline-none transition-colors duration-300 ${
                selectedCategory === category
                  ? 'border-b-4 border-blue-500 text-blue-500 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-100 dark:bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {post.content.replace(/(<([^>]+)>)/gi, '').slice(0, 100)}...
            </p>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block">
              Learn More
            </Link>
          </motion.div>
        ))}
      </div>

      {/* No Posts Found Message */}
      {filteredPosts.length === 0 && !loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10">No posts found in this category.</p>
      )}
    </main>
  );
}
