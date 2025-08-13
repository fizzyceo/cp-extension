import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
        setUser(session?.user ?? null);
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
      setUser(session?.user ?? null);
    });

    return () => {
      console.log("🧹 Cleaning up auth listener...");
      subscription.unsubscribe();
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

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
        console.log("✅ User state cleared and session removed from storage");
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    try {
      console.log("🔄 Manual refresh requested...");
      console.log("📦 Checking chrome storage...");
      const storage = await chrome.storage.local.get();
      console.log("📦 All storage contents:", storage);

      if (storage.session) {
        console.log("📦 Session found in storage:", storage.session);
        const { error } = await supabase.auth.setSession(storage.session);
        if (!error) {
          console.log("✅ Session restored from storage");
          setUser(storage.session.user);
        } else {
          console.error("❌ Error restoring session:", error);
        }
      } else {
        console.log("📦 No session in storage");
      }
    } catch (error) {
      console.error("❌ Error during manual refresh:", error);
    }
  };

  const handleTestOAuth = async () => {
    try {
      console.log("🧪 Testing OAuth flow manually...");
      const response = await chrome.runtime.sendMessage({
        type: "MANUAL_OAUTH_TEST",
      });
      console.log("🧪 Test OAuth response:", response);
    } catch (error) {
      console.error("❌ Error testing OAuth:", error);
    }
  };

  const handleCheckBackgroundScript = async () => {
    try {
      console.log("🔍 Checking background script communication...");
      const response = await chrome.runtime.sendMessage({
        type: "CHECK_SESSION",
      });
      console.log("🔍 Background script response:", response);
    } catch (error) {
      console.error("❌ Error checking background script:", error);
    }
  };

  console.log("🎨 Rendering App component, user state:", user);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Chrome Extension
      </h1>

      {user ? (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Welcome!</p>
            <p className="text-green-600 text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">Sign in to get started</p>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          <div className="space-y-2">
            <button
              onClick={handleManualRefresh}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              🔄 Manual Refresh (Debug)
            </button>

            <button
              onClick={handleTestOAuth}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              🧪 Test OAuth Flow
            </button>

            <button
              onClick={handleCheckBackgroundScript}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              🔍 Check Background Script
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
