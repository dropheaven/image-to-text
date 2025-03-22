"use client";
import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function ImageToText() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const processImage = async (imgSrc) => {
    setLoading(true);
    setText(""); // Reset text while loading
    try {
      const { data } = await Tesseract.recognize(imgSrc, "eng");
      setText(data.text || "No readable text found.");
      navigator.clipboard
        .writeText(data.text || "No readable text found.")
        .catch((err) => console.error("Clipboard copy failed:", err));
    } catch (error) {
      console.error("OCR Error:", error);
      setText("Error processing image. Try another one.");
    }
    setLoading(false);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const imgUrl = URL.createObjectURL(file); // Faster than FileReader
    setImage(imgUrl);
    processImage(imgUrl);
  };

  const handleImageUpload = (event) => {
    handleFileUpload(event.target.files[0]);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        handleFileUpload(item.getAsFile());
        break;
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFileUpload(event.dataTransfer.files[0]);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    const handleDragEnter = () => setDragging(true);
    const handleDragLeave = () => setDragging(false);

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Image to Text Extractor
      </h2>

      {/* File Upload */}
      <label
        htmlFor="fileInput"
        className="cursor-pointer"
        aria-label="Upload an image"
      >
        <input
          type="file"
          id="fileInput"
          onChange={handleImageUpload}
          className="hidden"
        />
        <div
          className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all 
            ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="text-gray-600">
            Drag & Drop an image here, click to upload, or{" "}
            <strong>paste (Ctrl+V)</strong>
          </p>
        </div>
      </label>

      {/* Image Preview */}
      {image && (
        <div className="mt-4 max-w-xs mx-auto">
          <img
            src={image}
            alt="Uploaded"
            className="w-full rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-4 text-blue-600 font-semibold animate-pulse">
          Processing image...
        </div>
      )}

      {/* Extracted Text & Copy Button */}
      {!loading && text && (
        <div className="mt-6 p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Extracted Text
          </h3>
          <p className="text-lg font-medium text-gray-900 whitespace-pre-line break-words">
            {text}
          </p>
          <button
            onClick={handleCopyText}
            aria-label="Copy extracted text"
            className="mt-4 flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-full shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
