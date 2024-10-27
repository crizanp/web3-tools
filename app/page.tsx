// app/page.tsx or app/home/page.tsx
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { posts } from "../lib/data";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import { FaLinkedin } from "react-icons/fa";

// Helper function to get the two latest posts
const getLatestPosts = () => posts.slice(0, 2);

export default function HomePage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLatestPosts(getLatestPosts());
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <PuffLoader color="#36D7B7" size={150} />
      </div>
    );
  }

  const metaTitle = "Welcome to My Space - Portfolio, Blog, and Projects";
  const metaDescription =
    "Explore projects, blogs, and insights shared by a passionate developer. Discover tutorials, latest projects, and more.";
  const metaUrl = "https://yourwebsite.com"; // Replace with your site URL
  const metaImage = "https://yourwebsite.com/images/og-image.png"; // Replace with your OG image URL

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:image" content={metaImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />
        <link rel="canonical" href={metaUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "My Portfolio",
            url: metaUrl,
          })}
        </script>
      </Head>
      <main className="p-2 pb-8 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 bg-gradient-to-br from-black via-gray-800 to-black min-h-screen relative">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.h1
          className="text-6xl font-bold text-white mb-5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to My Space
        </motion.h1>
        <motion.p
          className="text-xl text-gray-400"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          A space for projects, blogs, and ideas, where I share code, creativity,
          and personal insights.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            href="/about"
            className="text-white font-semibold px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Learn More About Me
          </Link>
        </motion.div>

        {/* LinkedIn Connect Button */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <a
            href="https://www.linkedin.com/in/yourusername" // Replace with your LinkedIn profile link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-white font-semibold px-3 py-1 "
          >
            <FaLinkedin className="mr-2 h-6 w-6" />
            Connect me on LinkedIn
          </a>
        </motion.div>
      </section>

      {/* Latest Posts Section */}
      <section className="mt-20">
        <h2 className="text-4xl text-white font-bold mb-10 text-center">
          Latest Blog Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {latestPosts.map((post) => (
            <motion.div
              key={post.id}
              className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-3">
                {post.title}
              </h3>
              <p className="text-gray-400 mb-5">{post.content.slice(0, 100)}...</p>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-500 hover:underline"
              >
                Learn More
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* My Latest Work Section */}
      <section className="mt-20">
        <h2 className="text-4xl text-white font-bold mb-10 text-center">
          My Latest Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {/* Project 1 */}
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="/images/1.png"
              alt="Project 1"
              className="rounded mb-5"
            />
            <h3 className="text-2xl font-bold text-white mb-3">NDSNEPAL</h3>
            <p className="text-gray-400 mb-5">
              NDSNEPAL is a social media marketing company that provides services
              for Facebook, Instagram, Tiktok, Telegram, Youtube, and many more.
            </p>
            <Link
              href="/"
              className="text-blue-500 hover:underline"
            >
              View Project
            </Link>
          </motion.div>

          {/* Project 2 */}
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src="/images/2.png" // Replace with your actual image paths
              alt="Project 2"
              className="rounded mb-5"
            />
            <h3 className="text-2xl font-bold text-white mb-3">
              Creative Science Project
            </h3>
            <p className="text-gray-400 mb-5">
              At Creative Science Project we guide and help you understand the
              science practical lessons from junior classes. DIY your projects
              and toys learning the science behind them.
            </p>
            <Link
              href="/"
              className="text-blue-500 hover:underline"
            >
              View Project
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Reading Post Section - Static */}
      <section className="mt-20">
        <h2 className="text-4xl text-white font-bold mb-10 text-center">
          My Latest Reading
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Book 1 */}
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              It Ends With Us - Colleen Hoover
            </h3>
            <p className="text-gray-400 mb-5">
              A poignant tale of love, resilience, and the complexities of
              relationships. A heart-wrenching story that will stay with you.
            </p>
            <Link
              href="/blog/powerful-quotes-from-it-ends-with-us-by-colleen-hoover"
              className="text-blue-500 hover:underline"
            >
              Read More
            </Link>
          </motion.div>

          {/* Book 2 */}
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              I Too Had a Love Story - Ravinder Singh
            </h3>
            <p className="text-gray-400 mb-5">
              A touching love story that captures the innocence of first love
              and the pain of loss, leaving readers deeply moved.
            </p>
            <Link
              href="/blog/i-too-had-a-love-story"
              className="text-blue-500 hover:underline"
            >
              Read More
            </Link>
          </motion.div>

          {/* Book 3 */}
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Verity - Colleen Hoover
            </h3>
            <p className="text-gray-400 mb-5">
              A thrilling psychological rollercoaster that explores the blurred
              lines between truth and fiction.
            </p>
            <Link href="/blog/verity" className="text-blue-500 hover:underline">
              Read More
            </Link>
          </motion.div>

          {/* Book 4 */}
          <motion.div
            className="bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              It Starts With Us - Colleen-Hoover 
            </h3>
            <p className="text-gray-400 mb-5">
            t Starts with Us by Colleen Hoover picks up where It Ends with Us leaves off, continuing the emotional journey of Lily Bloom as she navigates her life after making the difficult decision to end her relationship with Ryle.
            </p>
            <Link href="/blog/60-powerful-quotes-from-it-starts-with-us-by-colleen-hoover" className="text-blue-500 hover:underline">
              Read More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Animated Game-Like Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="w-32 h-32 bg-blue-600 rounded-full opacity-20 absolute top-10 left-10"
          animate={{ y: [0, -20, 20], rotate: [0, 360] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-24 h-24 bg-green-600 rounded-full opacity-20 absolute bottom-20 right-20"
          animate={{ y: [0, 20, -20], rotate: [360, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="w-40 h-40 bg-red-600 rounded-full opacity-20 absolute top-1/2 left-1/3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </main>
    </>
  );
}
