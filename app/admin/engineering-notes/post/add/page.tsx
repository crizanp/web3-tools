"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // for navigation after successful post
import dynamic from "next/dynamic"; // For dynamic import of React Quill
import "react-quill/dist/quill.snow.css"; // React Quill CSS

// Dynamic import of React Quill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function AddPostToSubject() {
  const [semesters, setSemesters] = useState([]); // Store semesters
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester name
  const [subjects, setSubjects] = useState([]); // Store subjects for the selected semester
  const [selectedSubject, setSelectedSubject] = useState(""); // Selected subject name
  const [title, setTitle] = useState(""); // Post title
  const [content, setContent] = useState(""); // HTML editor content (rich text editor)
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter(); // For navigation after form submission

  useEffect(() => {
    // Fetch the list of semesters
    async function fetchSemesters() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`);
        if (!res.ok) throw new Error("Failed to fetch semesters");
        const data = await res.json();
        setSemesters(data);
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    }

    fetchSemesters();
  }, []);

  // Fetch subjects when a semester is selected
  useEffect(() => {
    if (selectedSemester) {
      const semester = semesters.find((sem) => sem.name === selectedSemester);
      setSubjects(semester?.subjects || []);
    }
  }, [selectedSemester, semesters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    if (!title || !content || !selectedSemester || !selectedSubject) {
      alert("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const postData = {
      title,
      content,
    };

    try {
      // Send POST request to add the post using names
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/semesters/${encodeURIComponent(selectedSemester)}/subjects/${encodeURIComponent(selectedSubject)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (!res.ok) throw new Error("Failed to add post");

      alert("Post added successfully!");
      // Reset form fields
      setTitle("");
      setContent("");
      setSelectedSemester("");
      setSelectedSubject("");
      router.push("/admin"); // Optionally, redirect to another page
    } catch (error) {
      alert("Failed to add post.");
      console.error("Error adding post:", error);
    } finally {
      setLoading(false); // Stop loading after submission
    }
  };

  // Custom toolbar options for the Quill editor
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
    clipboard: {
      matchVisual: false,
    },
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

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Add Post to Subject</h1>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        {/* Semester Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Select Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem.name} value={sem.name}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        {selectedSemester && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Post Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Post Content (Rich Text Editor) */}
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2">Post Content</label>
          <ReactQuill
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
          className={`w-full bg-blue-600 text-white py-2 mt-9 px-4 rounded hover:bg-blue-700 transition ${
            loading ? "cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding Post..." : "Add Post"}
        </button>
      </form>
    </div>
  );
}
