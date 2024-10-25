import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
    return (
      <div className="flex min-h-screen"> {/* Use min-h-screen to ensure full height */}
        <div className="w-64 bg-gray-800"> {/* Add bg color for sidebar consistency */}
          <AdminSidebar />
        </div>
        <main className="flex-1 bg-gray-100 p-6">
          {children}
        </main>
      </div>
    );
}
