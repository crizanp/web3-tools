"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

// Modal component for post details
function PostDetailsModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <p className="mb-4">{post.content}</p>
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
function DeleteConfirmationModal({ postId, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">Do you really want to delete this post?</p>
        <div className="flex justify-between">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => onDelete(postId)}
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

export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]); // New state to store categories
  const [selectedPost, setSelectedPost] = useState(null); // For viewing post details
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation
  const [postToDelete, setPostToDelete] = useState(null);

  const token = Cookies.get("token");

  // Fetch posts and categories on page load
  useEffect(() => {
    async function fetchPostsAndCategories() {
      try {
        // Fetch posts
        const postsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!postsRes.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsRes.json();
        setPosts(Array.isArray(postsData) ? postsData : []);

        // Fetch categories
        const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPostsAndCategories();
  }, [token]);

  // Find the category name based on the category ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleDelete = async (postId) => {
    // Handle deletion here (make API call to delete the post)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete post');

      // Remove deleted post from state
      setPosts(posts.filter(post => post._id !== postId));
      setShowDeleteModal(false); // Close the modal
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Posts Management</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">SN</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Category</th> {/* New Category Column */}
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
  {posts.map((post, index) => (
    <tr key={post._id}>
      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
      <td
        className="py-2 px-4 border-b text-blue-500 cursor-pointer hover:underline"
        onClick={() => setSelectedPost(post)} // Open post details modal
      >
        {post.title}
      </td>
      <td className="py-2 px-4 border-b">
        {post.content ? post.content.slice(0, 50) : 'No description available'}...
      </td>
      <td className="py-2 px-4 border-b"> {/* Category Column */}
        {getCategoryName(post.category)} {/* Get category name by ID */}
      </td>
      <td className="py-2 px-4 border-b text-center">
        <Link href={`/admin/edit-post/${post._id}`} className="text-green-600 hover:underline">
          Edit
        </Link>
        <button
          className="text-red-600 ml-4 hover:underline"
          onClick={() => {
            setPostToDelete(post._id); // Set post to delete
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
          postId={postToDelete}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)} // Close the modal
        />
      )}
    </div>
  );
}
