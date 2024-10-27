// app/translation/page.tsx
"use client";

import React, { useState } from "react";
import Sanscript from "@sanskrit-coders/sanscript";
import Trie from "./utils/Trie";
import { wordMappings } from "./utils/wordMappings";
import nepaliWordsData from "./utils/nepaliWords.json" assert { type: 'json' }; // Import the JSON file
const nepaliWords = (nepaliWordsData as { nepaliWords: string[] }).nepaliWords;

// Extract Nepali words from the JSON file

// Initialize the Trie with Nepali words using Romanized keys
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
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setRomanInput(input);

    // Get the last word for suggestions
    const lastWord = input.split(" ").pop()?.toLowerCase() || "";

    // Get suggestions from the Trie for the last word typed
    if (lastWord) {
      const trieSuggestions = nepaliDictionaryTrie.search(lastWord).slice(0, 10);
      setSuggestions(trieSuggestions);
    } else {
      setSuggestions([]);
    }

    // Transliterate the input using Sanscript
    if (input) {
      setLoading(true);
      const unicodeOutput = Sanscript.t(input, "itrans", "devanagari");
      setUnicodeOutput(unicodeOutput);
      setLoading(false);
    } else {
      setUnicodeOutput("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const words = romanInput.trim().split(" ");
    words[words.length - 1] = suggestion;
    const newInput = words.join(" ");
    setRomanInput(newInput);
    handleInputChange({ target: { value: newInput } } as React.ChangeEvent<HTMLTextAreaElement>);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Romanized Nepali to Nepali Unicode with Suggestions
        </h1>
        
        {/* Render suggestions above the input */}
        {suggestions.length > 0 && (
          <ul className="bg-white border border-gray-300 rounded-lg mb-2 max-h-32 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        <div className="mb-6">
          <label htmlFor="romanInput" className="block text-gray-700 font-bold mb-2">
            Type Romanized Nepali
          </label>
          <textarea
            id="romanInput"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="e.g., kasto chha halkhabar"
            value={romanInput}
            onChange={handleInputChange}
            rows={4}
          ></textarea>
        </div>

        <div>
          <label htmlFor="unicodeOutput" className="block text-gray-700 font-bold mb-2">
            Nepali Unicode
          </label>
          <textarea
            id="unicodeOutput"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            value={loading ? "Loading..." : unicodeOutput}
            readOnly
            rows={4}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
