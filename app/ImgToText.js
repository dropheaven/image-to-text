"use client";
import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function ImageToText() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  const processImage = async (imgSrc) => {
    setLoading(true);
    try {
      const { data } = await Tesseract.recognize(imgSrc, "eng");
      setText(data.text);
    } catch (error) {
      console.error("OCR Error:", error);
      setText("Failed to extract text.");
    }
    setLoading(false);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      processImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event) => {
    handleFileUpload(event.target.files[0]);
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        handleFileUpload(item.getAsFile());
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

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Image to Text Extractor
      </h2>

      {/* File Upload */}
      <label className="block mb-4">
        <input
          type="file"
          onChange={handleImageUpload}
          className="hidden"
          id="fileInput"
        />
        <div
          className={`p-6 border-2 border-dashed ${
            dragging ? "border-blue-500" : "border-gray-300"
          } rounded-lg text-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="text-gray-600">
            Drag & Drop an image here, click to upload, or **paste (Ctrl+V)**
          </p>
        </div>
      </label>

      {/* Image Preview */}
      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt="Uploaded"
            className="w-full rounded-lg shadow"
          />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-4 text-blue-600 font-semibold animate-pulse">
          Processing image...
        </div>
      )}

      {/* Extracted Text */}
      {!loading && text && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold text-gray-800">Extracted Text:</h3>
          <p className="text-gray-700">{text}</p>
        </div>
      )}
    </div>
  );
}
