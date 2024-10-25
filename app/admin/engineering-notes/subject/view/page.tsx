"use client";
import { useState, useEffect } from "react";

// Modal component for delete confirmation
function DeleteConfirmationModal({ subjectName, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p className="mb-4">Do you really want to delete the subject "{subjectName}"?</p>
        <div className="flex justify-between">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => onDelete(subjectName)}
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

export default function ViewSubjects() {
  const [semesters, setSemesters] = useState([]); // Store all semesters
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester (by name)
  const [subjects, setSubjects] = useState([]); // Store subjects for the selected semester
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility
  const [subjectToDelete, setSubjectToDelete] = useState(null); // Subject to delete (by name)

  useEffect(() => {
    // Fetch the list of semesters on page load
    async function fetchSemesters() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`);
      const data = await res.json();
      setSemesters(data);
    }
    fetchSemesters();
  }, []);

  // Fetch subjects when a semester is selected
  useEffect(() => {
    async function fetchSubjects() {
      if (selectedSemester) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters/${selectedSemester}/subjects`);
        const data = await res.json();
        setSubjects(data);
      }
    }
    fetchSubjects();
  }, [selectedSemester]);

  // Handle delete subject
  const handleDelete = async (subjectName) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/semesters/${selectedSemester}/subject/${subjectName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      alert("Subject deleted successfully!");
      setSubjects(subjects.filter((sub) => sub.name !== subjectName));
      setShowDeleteModal(false); // Close the modal
    } else {
      alert("Failed to delete subject");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">View Subjects</h1>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Select Semester</label>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem.name} value={sem.name}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      {subjects.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">SN</th>
              <th className="py-2 px-4 border-b">Subject Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={subject.name}>
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b">{subject.name}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="text-blue-600 hover:underline mr-4"
                    onClick={() => alert("Edit subject functionality here")}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => {
                      setSubjectToDelete(subject.name);
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
        <p className="text-center text-gray-500">No subjects available</p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          subjectName={subjectToDelete}
          onDelete={handleDelete}
          onClose={() => setShowDeleteModal(false)} // Close the modal
        />
      )}
    </div>
  );
}
