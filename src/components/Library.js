import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const Library = ({ userId }) => {
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPrompts, setExpandedPrompts] = useState(new Set());

  useEffect(() => {
    if (userId) {
      fetchSavedPrompts();
    }
  }, [userId]);

  const fetchSavedPrompts = async () => {
    try {
      setLoading(true);

      // Fetch saved prompts for the current user
      const { data: savedData, error: savedError } = await supabase
        .from("saved_prompts")
        .select(
          `
          prompt_id,
          prompts (
            id,
            title,
            content,
            author_id
          )
        `
        )
        .eq("user_id", userId);

      if (savedError) {
        console.error("Error fetching saved prompts:", savedError);
        return;
      }

      // Filter out any null prompts and format the data
      const formattedPrompts = savedData
        .filter((item) => item.prompts)
        .map((item) => ({
          id: item.prompts.id,
          title: item.prompts.title,
          content: item.prompts.content,
          author_id: item.prompts.author_id,
        }));

      setSavedPrompts(formattedPrompts);
    } catch (error) {
      console.error("Error fetching saved prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePromptExpansion = (promptId) => {
    const newExpanded = new Set(expandedPrompts);
    if (newExpanded.has(promptId)) {
      newExpanded.delete(promptId);
    } else {
      newExpanded.add(promptId);
    }
    setExpandedPrompts(newExpanded);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (savedPrompts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No saved prompts yet
        </h3>
        <p className="text-gray-500">Your saved prompts will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Library</h2>
        <p className="text-gray-600">Access your saved prompts</p>
      </div>

      <div className="space-y-3">
        {savedPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            {/* Prompt Card Header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {prompt.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {prompt.content.length > 100
                    ? `${prompt.content.substring(0, 100)}...`
                    : prompt.content}
                </p>
              </div>

              {/* Plus Button */}
              <button
                onClick={() => togglePromptExpansion(prompt.id)}
                className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label={
                  expandedPrompts.has(prompt.id) ? "Hide prompt" : "Show prompt"
                }
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    expandedPrompts.has(prompt.id) ? "rotate-45" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            {/* Expandable Content */}
            {expandedPrompts.has(prompt.id) && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Full Prompt
                    </label>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {prompt.content}
                      </pre>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(prompt.content)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
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
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
