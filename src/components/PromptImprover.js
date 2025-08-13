import React, { useState } from "react";

const PromptImprover = () => {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [category, setCategory] = useState("general");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
    } catch (error) {
      console.error("Error generating improved prompt:", error);
      alert("Failed to generate improved prompt. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (improvedPrompt) {
      navigator.clipboard.writeText(improvedPrompt);
      alert("Improved prompt copied to clipboard!");
    }
  };

  const handleClear = () => {
    setOriginalPrompt("");
    setImprovedPrompt("");
    setCategory("general");
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

      {/* Original Prompt Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Original Prompt
        </label>
        <textarea
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !originalPrompt.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "🔄 Generating..." : "✨ Generate Improved Prompt"}
        </button>
      </div>

      {/* Improved Prompt Display */}
      {improvedPrompt && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Improved Prompt
            </label>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {improvedPrompt}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              📋 Copy to Clipboard
            </button>
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      )}

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
