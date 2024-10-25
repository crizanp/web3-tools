"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie to get the token
import dynamic from "next/dynamic"; // For dynamic import of React Quill
import slugify from "slugify"; // Slugify library to automatically generate slugs

// Dynamic import of React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css"; // React Quill CSS
import "highlight.js/styles/github.css"; // Optional, for syntax highlighting style

export default function AddPost() {
  const [title, setTitle] = useState(""); // Title of the post
  const [content, setContent] = useState(""); // HTML editor content
  const [imageUrl, setImageUrl] = useState(""); // Image URL for the post
  const [slug, setSlug] = useState(""); // Slug for the post (auto-generated)
  const [category, setCategory] = useState(""); // Category of the post
  const [categories, setCategories] = useState([]); // List of categories fetched from the backend
  const [tags, setTags] = useState(""); // Tags (comma-separated)
  const router = useRouter();

  useEffect(() => {
    // Fetch categories from the backend when the component mounts
    async function fetchCategories() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Add token in Authorization header
        },
      });
      const data = await res.json();
      setCategories(data); // Set the fetched categories
    }
    fetchCategories();
  }, []);

  // Automatically generate slug when title changes
  useEffect(() => {
    if (title) {
      setSlug(slugify(title, { lower: true, strict: true })); // Auto-generate slug
    }
  }, [title]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token"); // Get the token from cookies

    const postData = {
      title,
      content,
      imageUrl,
      slug,
      category,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert tags from a string to an array
    };

    // Send a POST request to the API to create a new post
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token in Authorization header
      },
      body: JSON.stringify(postData),
    });

    if (res.ok) {
      router.push("/admin"); // Redirect to the admin page after successful submission
    }
  };

  // Custom toolbar options for React Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Header levels
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"], // Text formatting options
      [{ color: [] }, { background: [] }], // Text color and background color
      [{ list: "ordered" }, { list: "bullet" }], // Lists (ordered/unordered)
      [{ script: "sub" }, { script: "super" }], // Superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // Indentation
      [{ align: [] }], // Text alignment
      ["blockquote", "code-block"], // Blockquote and Code Block options
      ["link", "image", "video"], // Media options (link, image, video)
      ["clean"], // Remove formatting
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Quill formats supported in the editor
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
    "indent",
    "align",
    "script",
    "blockquote",
    "link",
    "image",
    "video",
    "code-block", // Adding the code block format
  ];

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Post</h1>
      <form onSubmit={handleSubmit} className="mx-auto bg-white p-8 shadow-md rounded-md">
        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Post Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the post title"
            required
          />
        </div>

        {/* Slug Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Slug (Auto-generated, but editable)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)} // Editable slug
            placeholder="Post URL slug"
          />
        </div>

        {/* Image URL Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter an image URL for the post"
          />
        </div>

        {/* HTML Content Field with React Quill */}
        <div className="mb-16">
          <label className="block text-gray-700">Content</label>
          <ReactQuill
            className="w-full h-60"
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules} // Custom toolbar options
            formats={formats} // Supported formats
            placeholder="Write the content of your post, including code snippets..."
          />
        </div>

        {/* Category Field */}
        <div className="mb-6 mt-6">
          <label className="block text-gray-700">Category</label>
          <select
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Field */}
        <div className="mb-4">
          <label className="block text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags (comma-separated)"
          />
        </div>

        {/* Submit Button */}
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
}
