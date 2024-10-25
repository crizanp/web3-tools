"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

// Modal component for category details
function CategoryDetailsModal({ category, onClose }) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
        <p className="mb-4">{category.description || "No description available."}</p>
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
function DeleteConfirmationModal({ categoryId, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">Do you really want to delete this category?</p>
        <div className="flex justify-between">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => onDelete(categoryId)}
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

export default function ViewCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // For viewing category details
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const token = Cookies.get("token");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [token]);

  const handleDelete = async (categoryId) => {
    // Handle deletion here (make API call to delete the category)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete category');

      // Remove deleted category from state
      setCategories(categories.filter(category => category._id !== categoryId));
      setShowDeleteModal(false); // Close the modal
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Categories Management</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">SN</th>
            <th className="py-2 px-4 border-b">Category Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td className="py-2 px-4 border-b text-center">{index + 1}</td>
              <td
                className="py-2 px-4 border-b text-blue-500 cursor-pointer hover:underline"
                onClick={() => setSelectedCategory(category)} // Open category details modal
              >
                {category.name}
              </td>
              <td className="py-2 px-4 border-b">
                {category.description ? category.description.slice(0, 50) : 'No description available'}...
              </td>
              <td className="py-2 px-4 border-b text-center">
                <Link href={`/admin/edit-category/${category._id}`} className="text-green-600 hover:underline">
                  Edit
                </Link>
                <button
                  className="text-red-600 ml-4 hover:underline"
                  onClick={() => {
                    setCategoryToDelete(category._id); // Set category to delete
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

      {/* Category Details Modal */}
      {selectedCategory && (
        <CategoryDetailsModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)} // Close the modal
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          categoryId={categoryToDelete}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)} // Close the modal
        />
      )}
    </div>
  );
}
