"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // For routing
import dynamic from "next/dynamic"; // Dynamic import of React Quill
import "react-quill/dist/quill.snow.css"; // React Quill CSS
import Cookies from "js-cookie";

// Dynamic import of React Quill to prevent SSR issues with Next.js
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function EditPost() {
  const [post, setPost] = useState(null);  // State to hold the post to edit
  const [title, setTitle] = useState("");  // State to hold the updated title
  const [content, setContent] = useState("");  // State to hold the updated content
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const router = useRouter();
  const { semesterName, subjectName, slug } = useParams();  // Get the semesterName, subjectName, and slug from URL params
  const token = Cookies.get("token");

  // Fetch the post details for editing
  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/semesters/${semesterName}/subjects/${subjectName}/posts/${slug}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch post");

        const postData = await res.json();
        setPost(postData);
        setTitle(postData.title);  // Initialize with existing title
        setContent(postData.content);  // Initialize with existing content
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    }

    fetchPost();
  }, [semesterName, subjectName, slug, token]);

  // Handle the form submission to update the post
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/semesters/${semesterName}/subjects/${subjectName}/post/${post.slug}`,  // Use slug here
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!res.ok) throw new Error("Failed to update post");

      // Navigate back to the post list view after successful update
      router.push(`/admin/engineering-notes/post/view`);
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post");
    }
  };

  // Custom toolbar options for React Quill (rich text editor)
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"], // Text formatting options
      [{ color: [] }, { background: [] }], // Text color and background color
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }], // Text alignment
      ["blockquote", "code-block"], // Blockquote and Code Block options
      ["link", "image"], // Links and images
      ["clean"], // Remove formatting
    ],
  };

  // Supported formats in the text editor
  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
    "code-block",
  ];

  if (loading) {
    return <p className="text-center text-gray-600">Loading post data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Post</h1>

      {post ? (
        <form onSubmit={handleUpdate} className="mx-auto max-w-4xl">
          {/* Post Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Post Content (Rich Text Editor) */}
          <div className="mb-8">
            <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
              Post Content
            </label>
            <ReactQuill
              id="content"
              className="w-full h-64"
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating Post..." : "Update Post"}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600">Post not found</p>
      )}
    </div>
  );
}
