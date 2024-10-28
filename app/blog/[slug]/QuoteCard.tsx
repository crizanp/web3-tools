"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

export default function QuoteCardGenerator() {
  const [quote, setQuote] = useState("Your inspiring quote goes here...");
  const [author, setAuthor] = useState("Author Name");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [font, setFont] = useState("sans-serif");
  const [bgImage, setBgImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current);
      saveAs(dataUrl, "quote-card.png");
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Quote Card Generator</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Quote Card Preview */}
        <div
          className="flex-1 flex items-center justify-center bg-gray-200 p-4 rounded-lg"
          style={{ minHeight: "400px" }}
        >
          <motion.div
            ref={cardRef}
            className="w-full h-full flex flex-col justify-center items-center p-6 rounded-lg shadow-lg"
            style={{
              backgroundColor: bgColor,
              backgroundImage: bgImage ? `url(${bgImage})` : undefined,
              backgroundSize: "cover",
              fontFamily: font,
            }}
          >
            <p
              className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold"
              style={{ color: textColor }}
            >
              {quote}
            </p>
            <p
              className="mt-4 text-center text-lg md:text-xl lg:text-2xl"
              style={{ color: textColor }}
            >
              — {author}
            </p>
          </motion.div>
        </div>

        {/* Customization Panel */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-gray-700">Quote</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700">Author</label>
            <input
              className="w-full p-2 border rounded"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Background Color</label>
            <input
              type="color"
              className="w-full p-2"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Text Color</label>
            <input
              type="color"
              className="w-full p-2"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Font</label>
            <select
              className="w-full p-2 border rounded"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="sans-serif">Sans-Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Upload Background Image</label>
            <input type="file" onChange={handleBgImageUpload} className="w-full" />
          </div>
          <button
            onClick={handleDownload}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Download Quote Card
          </button>
        </div>
      </div>
    </div>
  );
}
