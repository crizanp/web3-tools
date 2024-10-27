'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50 border-b-2 border-gray-700"> {/* Sticky and border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="text-white text-3xl font-bold">
              Crizan
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/category" className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Categories
            </Link>
            <Link href="/category/telegram-api" className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Telegram Bot
            </Link>
            <Link href="/category/reading" className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Readings
            </Link>
            {/* <Link href="/blog" className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Blog
            </Link> */}
            <Link href="/about" className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            
            <Link href="/contact" className="text-white hover:bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-600 p-2 rounded-md"
              onClick={toggleMenu}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/category" className="text-white hover:bg-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Categories
            </Link>
            <Link href="/category/telegram-api" className="text-white hover:bg-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Telegram Bot
            </Link>
            <Link href="/category/reading" className="text-white hover:bg-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Reading
            </Link>
            <Link href="/about" className="text-white hover:bg-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              About
            </Link>
            <Link href="/contact" className="text-white hover:bg-gray-900 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
