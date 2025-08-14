import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { userService } from "./userService";
import PromptImprover from "./components/PromptImprover";
import Library from "./components/Library";
import UpgradePlan from "./components/UpgradePlan";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginForm from "./components/LoginForm";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [activeTab, setActiveTab] = useState("prompt-improver");

  useEffect(() => {
    console.log("🔍 App component mounted, checking for existing session...");

    // Listen for messages from background script
    const messageListener = (message, sender, sendResponse) => {
      console.log("📨 Message received in popup:", message);

      if (message.type === "SESSION_UPDATED") {
        console.log(
          "✅ Session updated from background script:",
          message.session
        );
        setUser(message.session.user);
        checkUserAccess(message.session.user.id);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Check for existing session in storage first
    const checkStoredSession = async () => {
      try {
        console.log("📦 Checking chrome storage for existing session...");
        const { session } = await chrome.storage.local.get("session");
        console.log("📦 Session found in storage:", session);

        if (session) {
          console.log("✅ Found stored session, setting it in Supabase...");
          const { error: supaAuthError } = await supabase.auth.setSession(
            session
          );
          if (!supaAuthError) {
            console.log(
              "✅ Stored session restored successfully:",
              session.user
            );
            setUser(session.user);
            checkUserAccess(session.user.id);
            return;
          } else {
            console.error("❌ Error restoring stored session:", supaAuthError);
          }
        } else {
          console.log("📦 No stored session found");
        }
      } catch (error) {
        console.error("❌ Error checking stored session:", error);
      }

      // Fallback to checking current session
      console.log("🔄 Checking current Supabase session...");
      const getSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("🔄 Current Supabase session:", session);
        if (session?.user) {
          setUser(session.user);
          checkUserAccess(session.user.id);
        }
      };

      getSession();
    };

    checkStoredSession();

    // Listen for auth changes
    console.log("👂 Setting up auth state change listener...");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("🔄 Auth state changed:", { event: _event, session });
      if (session?.user) {
        setUser(session.user);
        checkUserAccess(session.user.id);
      } else {
        setUser(null);
        setUserPlan(null);
        setUserData(null);
      }
    });

    return () => {
      console.log("🧹 Cleaning up auth listener...");
      subscription.unsubscribe();
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const checkUserAccess = async (userId) => {
    if (!userId) return;

    setCheckingAccess(true);
    try {
      console.log("🔍 Checking user access for ID:", userId);
      const accessInfo = await userService.checkUserAccess(userId);
      console.log("✅ Access check completed:", accessInfo);

      setUserPlan(accessInfo.plan);
      setUserData(accessInfo.userData);
    } catch (error) {
      console.error("❌ Error checking user access:", error);
      // Default to DISCOVER plan if there's an error
      setUserPlan("DISCOVER");
      setUserData(null);
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("🚀 Starting Google OAuth login...");
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: chrome.identity.getRedirectURL(),
        },
      });

      if (error) {
        console.error("❌ Error signing in with Google:", error.message);
        alert("Error signing in with Google: " + error.message);
        return;
      }

      console.log("✅ OAuth URL generated:", data.url);
      console.log("🔗 Opening new tab with OAuth URL...");

      // Open new tab with Supabase auth URL
      await chrome.tabs.create({ url: data.url });
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLoginSuccess = (user) => {
    console.log("✅ Email login successful, user:", user);
    setUser(user);
    checkUserAccess(user.id);
  };

  const handleSignOut = async () => {
    try {
      console.log("🚪 Starting sign out process...");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Error signing out:", error.message);
        alert("Error signing out: " + error.message);
      } else {
        console.log("✅ Sign out successful, clearing stored session...");
        // Clear stored session
        await chrome.storage.local.remove("session");
        setUser(null);
        setUserPlan(null);
        setUserData(null);
        console.log("✅ User state cleared and session removed from storage");
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Render content based on user state and plan
  const renderContent = () => {
    if (!user) {
      return (
        <LoginForm
          onGoogleLogin={handleGoogleLogin}
          onLoginSuccess={handleEmailLoginSuccess}
        />
      );
    }

    // User is logged in, check if we're still loading access info
    if (checkingAccess) {
      return <LoadingSpinner message="Checking your plan..." />;
    }

    // User is logged in and we have plan info
    if (userPlan === "DISCOVER") {
      return <UpgradePlan />;
    }

    // User has access (any plan other than DISCOVER) - Show tabbed interface
    return (
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("prompt-improver")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "prompt-improver"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Prompt Improver
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "library"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Library
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "prompt-improver" && <PromptImprover />}
          {activeTab === "library" && <Library userId={user.id} />}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-[512px] max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Copy&Prompt</h1>

      {/* User Info Header */}
      {user && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Welcome back!</p>
              <p className="font-medium text-gray-800">{user.email}</p>
              {userPlan && (
                <p className="text-xs text-gray-500">
                  Plan: <span className="font-medium">{userPlan}</span>
                </p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-medium rounded transition-colors"
            >
              {loading ? "..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {renderContent()}
    </div>
  );
}

export default App;
