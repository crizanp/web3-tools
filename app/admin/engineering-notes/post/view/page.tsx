"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';

// Modal component for post details
function PostDetailsModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <p className="mb-4" dangerouslySetInnerHTML={{ __html: post.content }}></p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Modal component for delete confirmation
function DeleteConfirmationModal({ post, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">Do you really want to delete this post?</p>
        <div className="flex justify-between">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ViewAllPosts() {
  const router = useRouter();  // Initialize router

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // For viewing post details
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const token = Cookies.get("token");

  // Fetch all semesters and extract posts on page load
  useEffect(() => {
    async function fetchSemesters() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch semesters");

        const semestersData = await res.json();

        // Extract posts from the semesters data
        const allPosts = [];
        semestersData.forEach((semester) => {
          if (semester.subjects && semester.subjects.length > 0) {
            semester.subjects.forEach((subject) => {
              if (subject.posts && subject.posts.length > 0) {
                subject.posts.forEach((post) => {
                  allPosts.push({
                    _id: post._id,
                    title: post.title,
                    slug: post.slug,
                    semesterId: semester._id,  // Store semester _id
                    subjectId: subject._id,    // Store subject _id
                    content: post.content,
                    semester: semester.name,
                    subject: subject.name,
                    createdAt: post.createdAt,
                    // Ensure we include _id for further actions
                  });
                });
              }
            });
          }
        });

        setPosts(allPosts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error.message);
        setLoading(false);
      }
    }

    fetchSemesters();
  }, [token]);

  // Handle post deletion using post _id
  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      console.log("Attempting to delete post:", postToDelete);

      const { semesterId, subjectId, _id: postId } = postToDelete; // Use the ids

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/semesters/${semesterId}/subjects/${subjectId}/post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter((post) => post._id !== postToDelete._id));
      setShowDeleteModal(false);
      alert("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Posts Management</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading posts...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : posts.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">SN</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Semester</th>
              <th className="py-2 px-4 border-b">Subject</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id}> {/* Use post._id as key */}
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td
                  className="py-2 px-4 border-b text-blue-500 cursor-pointer hover:underline"
                  onClick={() => setSelectedPost(post)} // Open post details modal
                >
                  {post.title}
                </td>
                <td className="py-2 px-4 border-b">
                  {post.content ? post.content.slice(0, 50) : "No description available"}...
                </td>
                <td className="py-2 px-4 border-b">{post.semester}</td>
                <td className="py-2 px-4 border-b">{post.subject}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      // Navigate to the edit post page with semesterName, subjectName, and postId
                      router.push(`/admin/engineering-notes/post/edit/${post.semester}/${post.subject}/${post.slug}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 ml-4 hover:underline"
                    onClick={() => {
                      setPostToDelete(post);
                      setShowDeleteModal(true); // Open delete confirmation modal
                    }}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No posts available.</p>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)} // Close the modal
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          post={postToDelete}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)} // Close the modal
        />
      )}
    </div>
  );
}
