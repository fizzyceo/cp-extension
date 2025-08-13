import React from "react";

const UpgradePlan = () => {
  const handleUpgrade = () => {
    // Open pricing page in a new tab
    chrome.tabs.create({ url: "https://copyandprompt.com/pricing" });
  };

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        {/* Lock Icon */}
        <div className="text-6xl">🔒</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800">Access Restricted</h2>

        {/* Message */}
        <div className="max-w-md mx-auto space-y-3">
          <p className="text-gray-600">
            You're currently on the{" "}
            <span className="font-semibold text-blue-600">DISCOVER</span> plan,
            which provides limited access to our features.
          </p>

          <p className="text-gray-600">
            Upgrade to unlock the full potential of our prompt improvement tools
            and access premium features.
          </p>
        </div>
      </div>

      {/* Upgrade Button */}
      <div className="space-y-3">
        <button
          onClick={handleUpgrade}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          🚀 Upgrade Your Plan
        </button>

        <p className="text-sm text-gray-500">
          Get unlimited access to all features
        </p>
      </div>

      {/* Features Preview */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          What You'll Get with Premium:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-700">
              Unlimited prompt improvements
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-700">Advanced AI models</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-700">Custom categories</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-700">Priority support</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-700">Export & sharing</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">✅</span>
            <span className="text-sm text-gray-700">Usage analytics</span>
          </div>
        </div>
      </div>

      {/* Current Plan Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Current Plan:</span> DISCOVER (Free)
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Limited to basic features and 5 prompt improvements per month
        </p>
      </div>
    </div>
  );
};

export default UpgradePlan;
