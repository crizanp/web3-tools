"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner"; // Import Spinner component

const engineeringNotes = {
  category: "Computer Engineering Notes",
  subcategories: [
    "1st Sem",
    "2nd Sem",
    "3rd Sem",
    "4th Sem",
    "5th Sem",
    "6th Sem",
    "7th Sem",
    "8th Sem",
  ],
};

const readingList = [
  { title: "It Ends With Us", slug: "it-starts-with-us" },
  { title: "It Starts With Us", slug: "it-starts-with-us" },
  { title: "I Too Had a Love Story", slug: "i-too-had-a-love-story" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true); // One loading state for entire content
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, postsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`),
        ]);

        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
        if (!postsRes.ok) throw new Error("Failed to fetch posts");

        const categoriesData = await categoriesRes.json();
        const postsData = await postsRes.json();

        const tagsSet = new Set();
        postsData.forEach((post) => {
          if (Array.isArray(post.tags)) {
            post.tags.forEach((tag) => tagsSet.add(tag));
          }
        });

        setCategories(categoriesData);
        setTags(Array.from(tagsSet));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading when both categories and tags are fetched
      }
    }

    fetchData();

    const timer = setTimeout(() => {
      setShowAd(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="p-10 bg-gradient-to-br from-black via-gray-800 to-black min-h-screen">
      {/* Spinner to show during loading */}
      <Spinner loading={loading} />

      {/* Only render the content when loading is false */}
      {!loading && (
        <>
          {/* Advertising Section */}
          {showAd && (
            <motion.div
              className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg mb-10 shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <button
                onClick={() => setShowAd(false)}
                className="absolute top-2 right-2 text-white text-xl font-bold hover:text-gray-300"
              >
                &times;
              </button>
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold">Professional Web Development</h2>
                <p className="text-lg mt-2">
                  Need a cutting-edge website or telegram bot for your business or services? We offer custom website development services tailored to your needs.
                </p>
                <Link href="/services" className="inline-block mt-4 bg-white text-black font-semibold py-2 px-4 rounded-full hover:bg-gray-200">
                  Learn More
                </Link>
              </div>
            </motion.div>
          )}

          {/* Dynamic Categories Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              <h2 className="text-4xl font-bold text-center mb-12 text-white">
                Explore by Categories
              </h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <Link href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`} key={index}>
                      <motion.div
                        className="cursor-pointer bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                        whileHover={{ scale: 1.05 }}
                      >
                        <h2 className="text-xl font-bold text-center">{category.name}</h2>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-white">No categories found</p>
                )}
              </motion.div>
            </div>

            {/* Tags Section */}
            <div className="md:col-span-1">
              <motion.div
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((tag, tagIndex) => (
                      <motion.div
                        key={tagIndex}
                        className="bg-blue-600 text-gray-300 py-2 px-4 rounded-full cursor-pointer hover:bg-blue-700 hover:text-white transition duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Link
                          href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-gray-300"
                        >
                          {tag}
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-white">No tags found</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Reading List Section */}
          <motion.div
            className="bg-gray-200 p-6 rounded-lg my-10 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center text-gray-900">
              <h2 className="text-3xl font-bold mb-6">Browse My Latest Reading</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {readingList.map((book, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg flex flex-col justify-between hover:bg-gray-800 hover:shadow-xl transition duration-300 ease-in-out"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-center">{book.title}</h3>
                      <p className="text-sm text-center">
                        Dive into the world of <strong>{book.title}</strong> and explore its story.
                      </p>
                    </div>
                    <div className="text-center mt-6">
                      <Link
                        href={`/blog/${book.slug}`}
                        className="inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300"
                      >
                        Read More
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/services" className="inline-block mt-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700">
                See All
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </main>
  );
}
