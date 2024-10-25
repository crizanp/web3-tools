import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="bg-gray-800 text-white h-full p-6 w-64">
      <h2 className="text-2xl font-bold mb-6">
        <Link href="/admin">Admin Panel</Link>
      </h2>
      <nav>
        <ul>
          {/* Section for General Post Management */}
          <li className="mb-4">
            <Link href="/admin/add-post" className="text-lg hover:text-gray-300">
              Add Post
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/posts" className="text-lg hover:text-gray-300">
              View Posts
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/add-category" className="text-lg hover:text-gray-300">
              Add Category
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/category" className="text-lg hover:text-gray-300">
              View Categories
            </Link>
          </li>

          {/* Section for Engineering Notes Management */}
          <li className="mb-4 mt-8 font-bold">Engineering Notes</li>

          {/* Semester Management */}
          <li className="mb-4">
            <Link href="/admin/engineering-notes/semester/add" className="text-lg hover:text-gray-300">
              Add Semester
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/engineering-notes/semester/view" className="text-lg hover:text-gray-300">
              View Semesters
            </Link>
          </li>

          {/* Subject Management */}
          <li className="mb-4">
            <Link href="/admin/engineering-notes/subject/add" className="text-lg hover:text-gray-300">
              Add Subject
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/engineering-notes/subject/view" className="text-lg hover:text-gray-300">
              View Subjects
            </Link>
          </li>

          {/* Post Management for Subjects */}
          <li className="mb-4">
            <Link href="/admin/engineering-notes/post/add" className="text-lg hover:text-gray-300">
              Add Post to Subject
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/engineering-notes/post/view" className="text-lg hover:text-gray-300">
              View Posts by Subject
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
