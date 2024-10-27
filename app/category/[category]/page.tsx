"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";

// Utility function to remove HTML tags from post content
const stripHtmlTags = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

// Component to render floating bubbles with low opacity and different colors
const FloatingBubbles = () => {
  const colors = ["#4C51BF", "#ED64A6", "#9F7AEA", "#F6AD55"]; // Array of different subtle colors
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            backgroundColor: colors[index % colors.length],
            width: `${Math.random() * 80 + 20}px`,
            height: `${Math.random() * 80 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.2, // Lower opacity for subtle effect
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.5, 1, 0.5],
            transition: { duration: Math.random() * 5 + 3, repeat: Infinity },
          }}
        />
      ))}
    </div>
  );
};

// Define the type for post
interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = decodeURIComponent(params.category); // Decoding the category from params
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state to manage the spinner
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const encodedCategory = encodeURIComponent(category);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/category/${encodedCategory}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching posts.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <PuffLoader color="#36D7B7" size={150} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h2 className="text-white  text-3xl text-center mb-4">{`Sorry, No Posts Available For " ${category} "`}</h2>
        <div className="flex gap-4">
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back to Home
          </Link>
          <Link
            href="/category"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            All Categories
          </Link>
        </div>
      </div>
    );
  }


  return (
    <main className="relative min-h-screen bg-gray-900 text-white p-10">
      <FloatingBubbles />
      <h1 className="text-5xl font-bold mb-10 text-center text-gray-200 neon-glow">
        {`Posts in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
      </h1>

      {/* Conditional Rendering based on the "Reading" category */}
      {category.toLowerCase() === "reading" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post._id}>
                <motion.div
                  className="relative p-6 bg-cover bg-center bg-no-repeat rounded-lg shadow-lg hover:shadow-2xl transition hover:bg-gray-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    backgroundImage: `url(${post.imageUrl || "/path-to-default-image.jpg"})`, // Fallback to default image if missing
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "#fff",
                  }}
                >
                  <div className="bg-black bg-opacity-90 p-4 rounded-lg">
                    <h2 className="text-3xl font-semibold mb-4 text-white neon-glow">
                      {post.title}
                    </h2>
                    <p className="text-gray-300 mb-6">
                      {stripHtmlTags(post.content).slice(0, 100)}...
                    </p>
                    <p className="text-blue-300 font-bold neon-glow">
                      Read More
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-2">No books found in this category.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post._id}>
                <motion.div
                  className="relative p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl hover:bg-gray-700 transition"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                  <p className="text-gray-400 mb-6">
                    {stripHtmlTags(post.content).slice(0, 100)}...
                  </p>
                  <p className="text-blue-400 hover:text-blue-600 transition">
                    Read More
                  </p>
                </motion.div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-2">No posts found in this category.</p>
          )}
        </div>
      )}
    </main>
  );
}
