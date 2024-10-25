"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Modal component for delete confirmation
function DeleteConfirmationModal({ semesterName, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">Do you really want to delete the semester "{semesterName}"?</p>
        <div className="flex justify-between">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => onDelete(semesterName)}
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

export default function ViewSemester() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const router = useRouter(); // To navigate on successful edit or delete

  // Fetch all semesters on page load
  useEffect(() => {
    async function fetchSemesters() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch semesters");
        }
        const data = await res.json();
        setSemesters(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSemesters();
  }, []);

  // Handle delete action
  const handleDelete = async (semesterName) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters/${semesterName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to delete semester");
      }
      setSemesters(semesters.filter((sem) => sem.name !== semesterName));
      setShowDeleteModal(false); // Close the modal
      alert("Semester deleted successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Semesters</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading semesters...</p>
      ) : (
        <>
          {semesters.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">SN</th>
                  <th className="py-2 px-4 border-b">Semester Name</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesters.map((semester, index) => (
                  <tr key={semester.name}>
                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                    <td className="py-2 px-4 border-b text-center">{semester.name}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="text-blue-600 hover:underline mr-4"
                        onClick={() => router.push(`/admin/edit-semester/${semester.name}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          setSemesterToDelete(semester.name);
                          setShowDeleteModal(true);
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
            <p className="text-center text-gray-500">No semesters available</p>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          semesterName={semesterToDelete}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)} // Close the modal
        />
      )}
    </div>
  );
}
