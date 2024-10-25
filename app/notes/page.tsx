"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PuffLoader from "react-spinners/PuffLoader"; // Import the loader

// Notes page to handle semester, subject, and post
export default function NotesPage() {
  const [semesters, setSemesters] = useState([]); // Store semesters
  const [selectedSemester, setSelectedSemester] = useState(null); // Currently selected semester
  const [subjects, setSubjects] = useState([]); // Store subjects for selected semester
  const [loadingSemesters, setLoadingSemesters] = useState(true); // Loading state for semesters
  const [loadingSubjects, setLoadingSubjects] = useState(true); // Loading state for subjects

  useEffect(() => {
    // Fetch all semesters when the component mounts
    async function fetchSemesters() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/semesters`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch semesters");

        const data = await res.json();
        setSemesters(data);
        setSelectedSemester(data[0]?.name); // Set the first semester name as the default selected semester
      } catch (error) {
        console.error("Error fetching semesters:", error);
      } finally {
        setLoadingSemesters(false); // Stop loading semesters
      }
    }

    fetchSemesters();
  }, []);

  // Function to fetch subjects for the selected semester
  useEffect(() => {
    if (!selectedSemester) return;

    async function fetchSubjects() {
      setLoadingSubjects(true); // Set loading for subjects

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/semesters/${selectedSemester}/subjects`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch subjects");

        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoadingSubjects(false); // Stop loading subjects
      }
    }

    fetchSubjects();
  }, [selectedSemester]);

  if (loadingSemesters) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <PuffLoader color="#36D7B7" size={150} />
      </div>
    );
  }

  return (
    <main className="p-10 bg-gradient-to-br from-black via-gray-800 to-black min-h-screen">
      {/* Introduction Section */}
      <section className="mb-12 text-white">
        <h1 className="text-4xl font-bold text-center mb-6">Welcome to Computer Engineering!</h1>
        <div className="mx-auto text-gray-200 space-y-4 leading-relaxed">
          <p>
            Computer Engineering is more than just writing code—it's about understanding how computers work from the ground up. Whether you're learning about microprocessors or designing complex algorithms, each topic builds the foundation for the technology-driven world we live in today.
          </p>
          <p>
            But here's the thing: success in Computer Engineering isn't just about sticking to the syllabus. While the curriculum gives you a solid foundation, it's important to go beyond what's taught in class. Why? Because the world of tech evolves rapidly. New frameworks, languages, and tools are constantly emerging, and companies value those who can adapt and learn on the go.
          </p>
          <p>
            So, how should you study? Dive deep into the subjects, but don't be afraid to experiment. Take on side projects, contribute to open source, or simply explore areas that spark your interest. This extra learning will not only make you a better engineer but will also prepare you for real-world challenges. The classroom is just the beginning—your journey in tech is much bigger!
          </p>
        </div>
      </section>

      {/* Semester Tabs */}
      <div className="flex flex-wrap justify-center mb-8 space-x-4">
        {semesters.length > 0 ? (
          semesters.map((semester) => (
            <button
              key={semester._id}
              onClick={() => setSelectedSemester(semester.name)} // Use semester name instead of ID
              className={`py-2 px-4 rounded-t-lg ${
                selectedSemester === semester.name
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } hover:bg-blue-500 transition-colors duration-300`}
            >
              {semester.name}
            </button>
          ))
        ) : (
          <p className="text-center text-white">No semesters found</p>
        )}
      </div>

      {/* Subject Cards */}
      {loadingSubjects ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <PuffLoader color="#36D7B7" size={100} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <Link
                key={subject._id}
                href={`/notes/${selectedSemester}/subject/${subject.name.toLowerCase()}`}
              >
                <motion.div
                  className="cursor-pointer bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
                  whileHover={{ scale: 1.05 }}
                >
                  <h2 className="text-xl font-bold text-center">{subject.name}</h2>
                </motion.div>
              </Link>
            ))
          ) : (
            <p className="text-center text-white">No subjects found</p>
          )}
        </div>
      )}
    </main>
  );
}
