"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PuffLoader } from "react-spinners";

const FloatingBubbles = () => {
  const colors = ["#4C51BF", "#ED64A6", "#9F7AEA", "#F6AD55"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(10)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            backgroundColor: colors[index % colors.length],
            width: `${Math.random() * 80 + 20}px`,
            height: `${Math.random() * 80 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.2,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [0.5, 1, 0.5],
            transition: { duration: Math.random() * 5 + 3, repeat: Infinity },
          }}
        />
      ))}
    </div>
  );
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission delay
    setTimeout(() => {
      setLoading(false);
      alert("Thank you for reaching out! We will get back to you shortly.");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <main className="relative min-h-screen bg-gray-900 text-white px-6 py-12 sm:p-12 md:p-16 lg:p-20 xl:p-24 2xl:p-28">
      <FloatingBubbles />
      <h1 className="text-5xl font-bold text-center mb-12 text-gray-200 neon-glow">
        Contact Us
      </h1>
      <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-200 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-200 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message"
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? <PuffLoader color="#36D7B7" size={24} /> : "Send Message"}
            </button>
          </div>
        </form>
      </div>
      {/* <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-200">Follow Us</h2>
        <div className="flex justify-center space-x-6">
          <a
            href="https://facebook.com"
            className="text-gray-400 hover:text-blue-500 transition"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook fa-2x"></i>
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-400 hover:text-blue-500 transition"
            aria-label="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter fa-2x"></i>
          </a>
          <a
            href="https://instagram.com"
            className="text-gray-400 hover:text-pink-500 transition"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram fa-2x"></i>
          </a>
          <a
            href="https://linkedin.com"
            className="text-gray-400 hover:text-blue-600 transition"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin fa-2x"></i>
          </a>
        </div>
      </div> */}
    </main>
  );
}
