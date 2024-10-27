"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PuffLoader from "react-spinners/PuffLoader";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
}

interface TagPageProps {
  params: {
    tag: string;
  };
}

// Function to strip HTML tags from a string
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const encodedTag = encodeURIComponent(tag);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/tag/${encodedTag}`
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
  }, [tag]);

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
        <h2 className="text-3xl text-center mb-4">{`No posts found for the tag: "${tag}"`}</h2>
        <Link
          href="/tags"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to All Tags
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10 text-center">
        {`Posts tagged with "${tag}"`}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post._id}>
              <motion.div
                className="p-4 sm:p-6 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4">{post.title}</h2>
                <p className="text-sm sm:text-base text-gray-400">
                  {stripHtml(post.content).slice(0, 100)}...
                </p>
                <p className="text-blue-400 hover:text-blue-600 mt-4">
                  Read More
                </p>
              </motion.div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-1 sm:col-span-2 lg:col-span-3">
            No posts found for this tag.
          </p>
        )}
      </div>
    </main>
  );
}
