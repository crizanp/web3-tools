"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";

// Component to render floating bubbles with low opacity and different colors
const FloatingBubbles = () => {
  const colors = ["#4C51BF", "#ED64A6", "#9F7AEA", "#F6AD55"];
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
            opacity: 0.2,
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
  tags?: string[];
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Utility function to remove HTML tags from post content
const stripHtmlTags = (html: string) => {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = decodeURIComponent(params.category);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

        // Cast the data to the expected type
        const data: Post[] = await response.json();
        setPosts(data);

        // Extract unique tags from posts
        const allTags = data.reduce((acc: string[], post: Post) => {
          if (post.tags) {
            acc.push(...post.tags);
          }
          return acc;
        }, []);
        setTags([...new Set(allTags)]); // Remove duplicates
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching posts."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [category]);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

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
        <h2 className="text-white text-3xl text-center mb-4">{`Sorry, No Posts Available For " ${category} "`}</h2>
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
    <main className="relative min-h-screen bg-gray-900 text-white px-4 py-8 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <FloatingBubbles />
      <h1 className="text-5xl font-bold mb-10 text-center text-gray-200 neon-glow">
        {`Posts in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
      </h1>

      {/* Scrollable Tags for Filtering - Only show if category is "reading" */}
      {category.toLowerCase() === "reading" && tags.length > 0 && (
        <div className="flex space-x-4 overflow-x-auto py-4 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full ${
              !selectedTag ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-300"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full ${
                selectedTag === tag
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Display Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post._id}>
              <motion.div
                className={`relative p-6 rounded-lg shadow-lg hover:shadow-2xl transition ${
                  category.toLowerCase() === "reading"
                    ? "bg-cover bg-center bg-no-repeat"
                    : "bg-gray-800"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={
                  category.toLowerCase() === "reading"
                    ? {
                        backgroundImage: `url(${post.imageUrl || "/path-to-default-image.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                <div className="bg-black bg-opacity-90 p-4 rounded-lg">
                  <h2 className="text-3xl font-semibold mb-4 text-white neon-glow">
                    {post.title}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {stripHtmlTags(post.content).slice(0, 100)}...
                  </p>
                  <p className="text-blue-300 font-bold neon-glow">Read More</p>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <p className="text-center col-span-2">No posts found in this category.</p>
        )}
      </div>
    </main>
  );
}
