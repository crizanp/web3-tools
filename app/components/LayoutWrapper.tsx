"use client"; // Mark this as a Client Component

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AdminLayout from './AdminLayout'; // Import AdminLayout

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith("/admin");

  // Check if the current route is the digitalgift or dexScreener page
  const isDigitalGiftPage = pathname === "/digitalgift";
  const isDexScreenerPage = pathname === "/dexScreener";

  return (
    <>
      {isAdminRoute ? (
        <AdminLayout> {/* Use AdminLayout for admin routes */}
          {children}
        </AdminLayout>
      ) : isDigitalGiftPage || isDexScreenerPage ? (
        // For digitalgift and dexScreener pages, render only the children without Navbar and Footer
        <>
          {children}
        </>
      ) : (
        // For all other routes, render the Navbar, main content, and Footer
        <>
          <Navbar /> {/* Show Navbar for non-admin routes */}
          {children} {/* Render the main page content */}
          <Footer /> {/* Show Footer for non-admin routes */}
        </>
      )}
    </>
  );
}
