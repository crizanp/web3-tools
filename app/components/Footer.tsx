import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Footer Links */}
          <div className="flex space-x-6 mb-6 md:mb-0">
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/projects" className="hover:text-white">
              Projects
            </Link>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            <Link href="/notes" className="hover:text-white">
              Engineering Notes
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4 mb-6 md:mb-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaLinkedin className="h-6 w-6" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <FaGithub className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Crizan Np. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
