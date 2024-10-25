"use client";
import { useEffect, useState } from "react";

export default function AddSemester() {
  const [semesterName, setSemesterName] = useState("");
  const [semesters, setSemesters] = useState([]); // Store semesters
  const [loading, setLoading] = useState(false); // Loading state for the semesters

  // Function to fetch all semesters
  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to load semesters");
      }
      const data = await res.json();
      setSemesters(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch semesters when the component mounts
  useEffect(() => {
    fetchSemesters();
  }, []);

  // Function to handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: semesterName }),
      });
      if (!res.ok) {
        throw new Error("Failed to add semester");
      }
      alert("Semester added successfully!");
      setSemesterName("");
      fetchSemesters(); // Fetch updated semesters after adding
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Semester</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-semibold mb-2">
              Semester Name
            </label>
            <input
              type="text"
              value={semesterName}
              onChange={(e) => setSemesterName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter semester name"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Add Semester
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">View All Semesters</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading semesters...</p>
        ) : (
          <ul className="space-y-2">
            {semesters.length > 0 ? (
              semesters.map((semester) => (
                <li
                  key={semester.name}
                  className="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition-all"
                >
                  <span className="text-lg font-semibold text-gray-700">{semester.name}</span>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No semesters available</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
