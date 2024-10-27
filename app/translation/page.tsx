// app/translation/page.tsx
"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";
import Sanscript from "@sanskrit-coders/sanscript";
import Trie from "./utils/Trie";
import { wordMappings } from "./utils/wordMappings";
import Spinner from "../components/Spinner";

// Lazy load the nepali words
const TranslationPage = () => {
  const [romanInput, setRomanInput] = useState("");
  const [unicodeOutput, setUnicodeOutput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const nepaliDictionaryTrie = useMemo(() => {
    const trie = new Trie();
    Object.entries(wordMappings).forEach(([roman, nepali]) => {
      trie.insert(roman, nepali);
    });
    return trie;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await import('./utils/nepaliWords.json')) as unknown as { nepaliWords: string[] };
      const nepaliWords = data.nepaliWords;
      nepaliWords.forEach((word) => {
        const romanizedWord = Sanscript.t(word, "devanagari", "itrans").toLowerCase();
        nepaliDictionaryTrie.insert(romanizedWord, word);
      });
      setLoading(false);
    };
  
    fetchData();
  }, [nepaliDictionaryTrie]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setRomanInput(input);

    const lastWord = input.split(" ").pop()?.toLowerCase() || "";

    if (lastWord) {
      const trieSuggestions = nepaliDictionaryTrie.search(lastWord).slice(0, 6);
      setSuggestions(trieSuggestions);
    } else {
      setSuggestions([]);
    }

    if (input) {
      const unicodeOutput = Sanscript.t(input, "itrans", "devanagari");
      setUnicodeOutput(unicodeOutput);
    } else {
      setUnicodeOutput("");
    }
  }, [nepaliDictionaryTrie]);

  const handleSuggestionClick = (suggestion: string) => {
    const words = romanInput.trim().split(" ");
    words[words.length - 1] = suggestion;
    const newInput = words.join(" ") + " ";
    setRomanInput(newInput);
    setSuggestions([]);
    inputRef.current?.focus();

    // Update the Unicode output with the new input
    const unicodeOutput = Sanscript.t(newInput, "itrans", "devanagari");
    setUnicodeOutput(unicodeOutput);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(unicodeOutput);
    setCopyMessage("तपाईंको पाठ प्रतिलिपि भएको छ");
    setTimeout(() => setCopyMessage(null), 3000); // Hide the message after 3 seconds
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-5">
      {/* Framer Motion Bubbles */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              width: `${Math.random() * 80 + 50}px`,
              height: `${Math.random() * 80 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ["-10%", "100%"],
              scale: [0.9, 1.1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <div className="relative bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl z-10">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Romanized Nepali to Nepali Unicode
        </h1>

        {/* Display copy message if exists */}
        {copyMessage && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4 text-center">
            {copyMessage}
          </div>
        )}

        {/* Show Spinner while loading */}
        <Spinner loading={loading} />

        {/* Render suggestions above the input if not loading */}
        {!loading && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-600"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="romanInput" className="block text-gray-400 font-bold mb-2">
            Type Romanized Nepali
          </label>
          <textarea
            id="romanInput"
            ref={inputRef}
            className="w-full p-3 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="e.g., kasto chha halkhabar"
            value={romanInput}
            onChange={handleInputChange}
            rows={4}
          ></textarea>
        </div>

        <div className="relative">
          <label htmlFor="unicodeOutput" className="block text-gray-400 font-bold mb-2">
            Nepali Unicode (Output)
          </label>
          <textarea
            id="unicodeOutput"
            className="w-full p-3 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            value={unicodeOutput}
            readOnly
            rows={4}
          ></textarea>
          <button
            onClick={copyToClipboard}
            className="absolute top-5 right-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationPage;
