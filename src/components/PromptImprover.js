import React, { useState } from "react";

const PromptImprover = () => {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [category, setCategory] = useState("general");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproved, setIsImproved] = useState(false);

  const categories = [
    {
      value: "general",
      label: "General Writing",
      systemPrompt:
        "You are a professional writing assistant. Improve the given prompt to be more clear, specific, and actionable while maintaining the original intent.",
    },
    {
      value: "creative",
      label: "Creative Writing",
      systemPrompt:
        "You are a creative writing expert. Enhance the given prompt to be more imaginative, engaging, and inspiring while preserving the creative essence.",
    },
    {
      value: "business",
      label: "Business & Professional",
      systemPrompt:
        "You are a business communication specialist. Refine the given prompt to be more professional, concise, and results-oriented.",
    },
    {
      value: "academic",
      label: "Academic & Research",
      systemPrompt:
        "You are an academic writing expert. Improve the given prompt to be more precise, structured, and research-oriented.",
    },
    {
      value: "technical",
      label: "Technical & Programming",
      systemPrompt:
        "You are a technical writing expert. Enhance the given prompt to be more specific, detailed, and technically accurate.",
    },
  ];

  const handleGenerate = async () => {
    if (!originalPrompt.trim()) {
      alert("Please enter a prompt first.");
      return;
    }

    setIsGenerating(true);

    try {
      // For now, we'll simulate the API call with a mock response
      // In the future, this will call your actual AI service
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API delay

      const selectedCategory = categories.find((cat) => cat.value === category);
      const mockImprovedPrompt = `[${selectedCategory.label.toUpperCase()}] ${originalPrompt}\n\nImproved version: ${originalPrompt} - Enhanced with better clarity, structure, and ${category} best practices.`;

      setImprovedPrompt(mockImprovedPrompt);
      setIsImproved(true);
    } catch (error) {
      console.error("Error generating improved prompt:", error);
      alert("Failed to generate improved prompt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isImproved ? improvedPrompt : originalPrompt;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      alert("Prompt copied to clipboard!");
    }
  };

  const handleClear = () => {
    setOriginalPrompt("");
    setImprovedPrompt("");
    setCategory("general");
    setIsImproved(false);
  };

  const handleReset = () => {
    setOriginalPrompt(improvedPrompt);
    setImprovedPrompt("");
    setIsImproved(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Prompt Improver
        </h2>
        <p className="text-gray-600">
          Transform your prompts into powerful, clear, and effective versions
        </p>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Prompt Input - Original or Improved */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isImproved ? "Improved Prompt" : "Your Original Prompt"}
        </label>
        <div className="relative">
          <textarea
            value={isImproved ? improvedPrompt : originalPrompt}
            onChange={(e) => {
              if (isImproved) {
                setImprovedPrompt(e.target.value);
              } else {
                setOriginalPrompt(e.target.value);
              }
            }}
            placeholder={
              isImproved
                ? "Your improved prompt..."
                : "Enter your prompt here..."
            }
            rows={4}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              isImproved ? "bg-pink-50" : "bg-white"
            }`}
          />

          {/* Copy Icon Button - Top Right */}
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-3">
        {!isImproved ? (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !originalPrompt.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? "🔄 Generating..." : "✨ Generate Improved Prompt"}
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              🔄 Use as Original
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
        )}
      </div>

      {/* Category Info */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Current Category:{" "}
          {categories.find((cat) => cat.value === category)?.label}
        </h3>
        <p className="text-sm text-blue-700">
          {categories.find((cat) => cat.value === category)?.systemPrompt}
        </p>
      </div>
    </div>
  );
};

export default PromptImprover;
