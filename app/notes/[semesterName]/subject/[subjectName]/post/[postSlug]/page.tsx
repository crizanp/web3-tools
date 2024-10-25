"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import parse, { domToReact } from "html-react-parser";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faLink } from "@fortawesome/free-solid-svg-icons"; // Import an icon
import PuffLoader from "react-spinners/PuffLoader"; // Import PuffLoader for spinner
import Link from "next/link"; // Import Link for breadcrumb navigation

// Floating bubbles background component
const FloatingBubbles = () => {
  const colors = ["#4C51BF", "#ED64A6", "#9F7AEA"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            backgroundColor: colors[index % colors.length],
            width: `${Math.random() * 80 + 40}px`,
            height: `${Math.random() * 80 + 40}px`,
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

// Function to extract raw text from DOM nodes (recursively)
const getRawTextFromDomNode = (node) => {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(getRawTextFromDomNode).join("");
  }
  if (node && node.props && node.props.children) {
    return getRawTextFromDomNode(node.props.children);
  }
  return "";
};

export default function NotesDetailPage() {
  const { semesterName, subjectName, postSlug } = useParams(); // Get semester, subject, and postSlug from the dynamic route
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]); // Table of contents state

  // Custom function to handle HTML parsing and highlight code blocks
  const customParseOptions = (headingList) => ({
    replace: (domNode) => {
      if (domNode.name === "a" && domNode.attribs.href) {
        const href = domNode.attribs.href;
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700 transition-all"
          >
            {domToReact(domNode.children)}
          </a>
        );
      }

      if (domNode.name === "blockquote") {
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
            {domToReact(domNode.children)}
          </blockquote>
        );
      }

      if (domNode.attribs && domNode.attribs.class === "ql-syntax") {
        const codeContent = getRawTextFromDomNode(domToReact(domNode.children));
        const language = domNode.attribs["data-language"] || "javascript";
        const highlightedCode = Prism.highlight(
          codeContent,
          Prism.languages[language],
          language
        );

        return (
          <div className="relative bg-white p-4 rounded-md overflow-x-auto mb-5">
            <pre className="text-black">
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>
        );
      }

      if (domNode.name === "h1" || domNode.name === "h2" || domNode.name === "h3") {
        const headingText = getRawTextFromDomNode(domToReact(domNode.children));
        const headingId = headingText.toString().replace(/\s+/g, "-").toLowerCase(); // Create anchor-friendly ID

        headingList.push({ id: headingId, text: headingText, tag: domNode.name });

        return React.createElement(
          domNode.name,
          { id: headingId, className: `font-bold my-2 ${domNode.name === "h1" ? "text-4xl" : domNode.name === "h2" ? "text-3xl" : "text-2xl"}` },
          domToReact(domNode.children)
        );
      }
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const postResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/semesters/${semesterName}/subjects/${subjectName}/posts/${postSlug}`
        );
        if (!postResponse.ok) throw new Error("Post not found");
        const postData = await postResponse.json();
        setPost(postData);

        const headingList = [];
        parse(postData.content, customParseOptions(headingList));
        setTableOfContents(headingList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [semesterName, subjectName, postSlug]);

  useEffect(() => {
    if (post) {
      Prism.highlightAll();
    }
  }, [post]);

// Breadcrumb navigation
const breadcrumbItems = [
  { name: "Engineering Notes", href: "/notes" },
  { name: subjectName, href: `/notes/${semesterName}/subject/${subjectName}` },
];

if (post) {
  breadcrumbItems.push({ name: post.title, href: `/notes/${semesterName}/subject/${subjectName}/post/${postSlug}` });
}
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <PuffLoader color="#36D7B7" size={150} />
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;
  if (!post) return notFound();

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-10">
      <FloatingBubbles />

      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ul className="flex flex-wrap text-white text-sm space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <Link href={item.href} className="hover:underline">
                {item.name.replace(/%20/g, " ")}
              </Link>
              {index < breadcrumbItems.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-center">
        {post.title}
      </h1>

      <main className="max-w-4xl mx-auto">
        <p className="text-gray-400 mb-10 text-center">
          {new Date(post.createdAt).toDateString()}
        </p>

        {tableOfContents.length > 0 && (
          <div className="mb-10 bg-gray-800 p-5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Table of Contents</h2>
            <ul className="space-y-2 list-disc list-inside">
              {tableOfContents.map((heading, index) => (
                <li key={index} className="flex items-center">
                  <FontAwesomeIcon icon={faLink} className="text-blue-400 mr-2" />
                  <a href={`#${heading.id}`} className="text-blue-500 hover:text-blue-700">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <article className="prose lg:prose-xl dark:prose-invert mx-auto">
          {post && parse(post.content, customParseOptions([]))}
        </article>
      </main>
    </div>
  );
}
