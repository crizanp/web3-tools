"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Sanscript from "@sanskrit-coders/sanscript";
import Trie from "./utils/Trie";
import { wordMappings } from "./utils/wordMappings";
import nepaliWordsData from "./utils/nepaliWords.json" assert { type: "json" };
import Spinner from "../components/Spinner";
import debounce from "lodash/debounce";

interface NepaliWordsData {
  nepaliWords: string[];
}

const nepaliWords = (nepaliWordsData as NepaliWordsData).nepaliWords;

const nepaliDictionaryTrie = new Trie();
Object.entries(wordMappings).forEach(([roman, nepali]) => {
  nepaliDictionaryTrie.insert(roman, nepali);
});
nepaliWords.forEach((word) => {
  const romanizedWord = Sanscript.t(word, "devanagari", "itrans").toLowerCase();
  nepaliDictionaryTrie.insert(romanizedWord, word);
});

export default function TranslationPage() {
  const [romanInput, setRomanInput] = useState("");
  const [unicodeOutput, setUnicodeOutput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error during setup:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  }, 300);

  const handleSuggestionClick = (suggestion: string) => {
    const words = romanInput.trim().split(" ");
    words[words.length - 1] = suggestion;
    const newInput = words.join(" ") + " ";
    setRomanInput(newInput);
    handleInputChange({ target: { value: newInput } } as React.ChangeEvent<HTMLTextAreaElement>);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(unicodeOutput);
    setCopyMessage("तपाईंको पाठ प्रतिलिपि भएको छ");
    setTimeout(() => setCopyMessage(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ["-20%", "100%"],
              x: ["-20%", "100%"],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="relative bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 w-full max-w-2xl z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-center">
          Romanized Nepali to Nepali Unicode
        </h1>

        {copyMessage && (
          <motion.div
            className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {copyMessage}
          </motion.div>
        )}

        {loading && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Spinner loading={loading} />
          </motion.div>
        )}

        {!loading && suggestions.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-600"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </motion.div>
        )}

        {!loading && (
          <>
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
