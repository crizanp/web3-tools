"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const predefinedImages = [
  "",
  "https://images.unsplash.com/photo-1653654650017-6b6c457b3a00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIzfHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1649336320848-d350bb92d685?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1649770637836-4cb2971a17db?q=80&w=1866&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1651973985408-1a66baa62ee9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1649770638727-6056d269d587?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1651973999246-66f6701e91ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1649336321305-3fe272852c94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673697240011-76f7f9220300?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1619995745882-f4128ac82ad6?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const presetStyles = [
  { name: "Classic", bgColor: "#ffffff", textColor: "#000000", font: "serif" },
  { name: "Dark Mode", bgColor: "#333333", textColor: "#ffffff", font: "monospace" },
  { name: "Vintage", bgColor: "#f5f5dc", textColor: "#5a5a5a", font: "cursive" },
];

const availableFonts = [
  "Arial",
  "Georgia",
  "Helvetica",
  "Times New Roman",
  "Verdana",
  "Courier New",
  "Lucida Sans",
  "Tahoma",
  "Trebuchet MS",
  "Comic Sans MS",
];

const presetColors = [
  { name: "Blue & White", bgColor: "#0000ff", textColor: "#ffffff" },
  { name: "Black & Yellow", bgColor: "#000000", textColor: "#ffff00" },
  { name: "Red & White", bgColor: "#ff0000", textColor: "#ffffff" },
  { name: "Green & Black", bgColor: "#00ff00", textColor: "#000000" },
];

export default function QuoteCardModal({ quote = "", author = "Cizan", isOpen, onClose }) {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [font, setFont] = useState("sans-serif");
  const [fontSize, setFontSize] = useState(24);
  const [customAuthor, setCustomAuthor] = useState(author);
  const [customQuote, setCustomQuote] = useState(quote);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [imageFilter, setImageFilter] = useState({ brightness: 100, blur: 0 });
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomAuthor(author);
    setCustomQuote(quote);
  }, [author, quote]);

  useEffect(() => {
    const baseFontSize = 24;
    const adjustedFontSize = Math.max(12, baseFontSize - customQuote.length / 10);
    setFontSize(adjustedFontSize);
  }, [customQuote]);

  const handleDownload = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current);
      saveAs(dataUrl, "quote-card.png");

      const userAgent = navigator.userAgent || navigator.vendor;
      const isSocialMediaBrowser = /FBAN|FBAV|Instagram/.test(userAgent);

      if (isSocialMediaBrowser) {
        setShowDownloadMessage(true);
      }
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

  const handlePredefinedImageClick = (imageUrl: string) => {
    setBgImage(imageUrl);
  };

  const applyPresetStyle = (preset) => {
    setBgColor(preset.bgColor);
    setTextColor(preset.textColor);
    setFont(preset.font);
  };

  const applyPresetColor = (color) => {
    setBgColor(color.bgColor);
    setTextColor(color.textColor);
  };

  const handleCloseMessage = () => {
    setShowDownloadMessage(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <motion.div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl md:max-w-5xl h-full max-h-[90vh] overflow-y-auto p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black text-center">Customize Your Quote Card</h2>

        <div className="text-black">
          {/* Preset Styles */}
          <div className="flex gap-2 overflow-x-auto mb-4">
            {presetStyles.map((preset, index) => (
              <button
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-lg shadow-sm text-sm"
                onClick={() => applyPresetStyle(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Preset Colors */}
          <div className="flex gap-2 overflow-x-auto mb-4">
            {presetColors.map((color, index) => (
              <button
                key={index}
                className="px-3 py-1 rounded-lg shadow-sm text-sm"
                style={{ backgroundColor: color.bgColor, color: color.textColor }}
                onClick={() => applyPresetColor(color)}
              >
                {color.name}
              </button>
            ))}
          </div>

          {/* Predefined Backgrounds */}
          <div className="flex gap-2 overflow-x-auto mb-4">
            {predefinedImages.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="min-w-[60px] h-20 rounded-lg shadow-md cursor-pointer"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handlePredefinedImageClick(image)}
              />
            ))}
          </div>

          {/* Quote Card Preview */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-gray-700 p-0.5">
              <div
                ref={cardRef}
                className="w-full h-60 md:h-80 lg:h-full flex flex-col justify-center items-center p-6 shadow-lg overflow-hidden"
                style={{
                  backgroundColor: bgColor,
                  backgroundImage: bgImage ? `url(${bgImage})` : undefined,
                  backgroundSize: "cover",
                  filter: `brightness(${imageFilter.brightness}%) blur(${imageFilter.blur}px)`,
                  fontFamily: font,
                  color: textColor,
                }}
              >
                <textarea
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  className="text-center font-semibold w-full px-4 bg-transparent resize-none overflow-hidden outline-none"
                  style={{ fontSize: `${fontSize}px`, color: textColor, lineHeight: "1.2em" }}
                  rows={10}
                />
                <input
                  type="text"
                  value={customAuthor}
                  onChange={(e) => setCustomAuthor(e.target.value)}
                  className="mt-4 text-center bg-transparent resize-none outline-none"
                  style={{ fontSize: `${Math.max(12, fontSize - 4)}px`, color: textColor }}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            {/* Customization Controls */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-gray-700">Font</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full p-2 border rounded text-black"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Background Color</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Brightness</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={imageFilter.brightness}
                  onChange={(e) =>
                    setImageFilter({ ...imageFilter, brightness: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-gray-700">Blur</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={imageFilter.blur}
                  onChange={(e) =>
                    setImageFilter({ ...imageFilter, blur: Number(e.target.value) })
                  }
                  className="w-full"
                />
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
      </motion.div>

      {/* Download Message Modal */}
      {showDownloadMessage && (
        <motion.div
          className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="text-black mb-4">Your quote card is ready! Please long press the image to save it if you're using a social media browser.</p>
            <button
              onClick={handleCloseMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
