"use client";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-400">
          The page you are looking for might have been removed, or is temporarily unavailable.
        </p>
        <Link href="/" className="mt-6 text-blue-500 hover:underline">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}
