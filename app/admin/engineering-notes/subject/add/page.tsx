"use client";
import { useState, useEffect } from "react";

export default function AddSubject() {
  const [semesters, setSemesters] = useState([]); // Store the list of semesters
  const [selectedSemester, setSelectedSemester] = useState(""); // Selected semester name
  const [subjectName, setSubjectName] = useState(""); // Subject name input
  const [loading, setLoading] = useState(false); // Loading state during fetch/post

  useEffect(() => {
    // Fetch the list of semesters
    async function fetchSemesters() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`);
        if (!res.ok) throw new Error("Failed to fetch semesters");
        const data = await res.json();
        setSemesters(data);
      } catch (error) {
        alert(error.message);
      }
    }

    fetchSemesters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while processing

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/semesters/${selectedSemester}/subject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subjectName }),
        }
      );

      if (res.ok) {
        alert("Subject added successfully!");
        setSubjectName(""); // Clear the input
      } else {
        throw new Error("Failed to add subject");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Set loading to false after process completes
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Add Subject to Semester
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Semester Selection */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Select Semester</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select</option>
            {semesters.map((sem) => (
              <option key={sem.name} value={sem.name}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Name Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Subject Name</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          }`}
          disabled={loading}
        >
          {loading ? "Adding Subject..." : "Add Subject"}
        </button>
      </form>
    </div>
  );
}
