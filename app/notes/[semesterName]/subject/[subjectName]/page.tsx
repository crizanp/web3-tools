"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import PuffLoader from "react-spinners/PuffLoader";

// Function to remove HTML tags and return plain text
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Function to safely get a decoded string from useParams (handles string[] or string)
const safeParamToString = (param) => {
  const paramString = Array.isArray(param) ? param.join("") : param;
  return decodeURIComponent(paramString || "");
};

export default function NotesDetailPage() {
  const { subjectName, semesterName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert subjectName and semesterName safely to decoded strings
  const subjectNameStr = safeParamToString(subjectName);
  const semesterNameStr = safeParamToString(semesterName);

  useEffect(() => {
    if (!subjectNameStr || !semesterNameStr) return;

    async function fetchPosts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/semesters/${semesterNameStr}/subjects/${subjectNameStr}/posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [subjectNameStr, semesterNameStr]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <PuffLoader color="#36D7B7" size={150} />
      </div>
    );
  }

  // Breadcrumb navigation
  const breadcrumbItems = [
    { name: "Engineering Notes", href: "/notes" },
    { name: semesterNameStr, href: `/notes/${semesterNameStr}` },
    { name: subjectNameStr, href: `/notes/${semesterNameStr}/subject/${subjectNameStr}` },
  ];

  return (
    <main className="p-10 bg-gradient-to-br from-black via-gray-800 to-black min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ul className="flex flex-wrap text-white text-sm space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <Link href={item.href} className="hover:underline">
                {item.name}
              </Link>
              {index < breadcrumbItems.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Motivational Section at the Top */}
      <section className="mb-10 text-white text-center">
        <div className="mx-auto text-gray-200 text-left space-y-4 leading-relaxed">
          <p>
            Studying isn't just about reading through the notes. Sure, these
            resources will give you a strong foundation, but remember, a strong
            foundation is just the beginning of building a great skyscraper of
            knowledge.
          </p>
          <p>
            Don't just stop at the notes provided here! Your library has
            treasures waiting for you. Find the best author on the topic, crack
            open that hefty book, and dive deep. Because as they say, "A mind
            needs books as a sword needs a whetstone." (Yes, I totally borrowed
            that from *Game of Thrones*, but it fits!)
          </p>
          <p>
            "Learning never exhausts the mind," said Leonardo da Vinci, but you
            can bet sticking to just the syllabus might bore it to pieces. Go
            beyond, explore, experiment, and get curious! After all, "Google is
            great, but the library is still magic."
          </p>
        </div>
      </section>

      {/* Posts for the Subject */}
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        Notes for {subjectNameStr}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              href={`/notes/${semesterNameStr}/subject/${subjectNameStr}/post/${post.slug}`}
              key={post._id}
            >
              <motion.div
                className="cursor-pointer bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:border-blue-600 transition-all duration-300 ease-in-out"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-blue-400">
                      {post.title}
                    </h3>
                    <p className="text-base text-gray-400 mb-6">
                      {stripHtml(post.excerpt || post.content.slice(0, 100)) +
                        "..."}
                    </p>
                  </div>
                  <div className="text-sm text-blue-300 font-semibold">
                    <p>Read More</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))
        ) : (
          <p className="text-center text-white">No posts found</p>
        )}
      </div>
    </main>
  );
}
