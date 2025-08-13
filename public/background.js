// Background script to handle OAuth callback
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sjegnqevpqzeynnkecdq.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZWducWV2cHF6ZXlubmtlY2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMzAzNjksImV4cCI6MjA2OTgwNjM2OX0.Vz9UOAOtxUXJw_3jNIK5wo2WBVYdrVUcrLoWzFUol-I";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Background script loaded successfully");

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📨 Message received in background script:", message);

  if (message.type === "CHECK_SESSION") {
    chrome.storage.local.get("session").then(({ session }) => {
      console.log("📦 Session check requested, current session:", session);
      sendResponse({ session });
    });
    return true; // Keep message channel open for async response
  }

  if (message.type === "MANUAL_OAUTH_TEST") {
    console.log("🧪 Manual OAuth test requested");
    // Simulate OAuth completion for testing
    testOAuthFlow();
    sendResponse({ success: true });
  }
});

// Add tab listener when background script starts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab updated:", { tabId, changeInfo, tab });

  if (changeInfo.url) {
    console.log("URL changed to:", changeInfo.url);
    console.log("Expected redirect URL:", chrome.identity.getRedirectURL());

    // Check if this is the expected OAuth redirect URL
    if (changeInfo.url.startsWith(chrome.identity.getRedirectURL())) {
      console.log("✅ OAuth callback detected! Processing...");
      finishUserOAuth(changeInfo.url);
      return;
    }

    // Fallback: Check if this URL contains OAuth tokens (for copyandprompt.com redirects)
    if (
      changeInfo.url.includes("access_token=") &&
      changeInfo.url.includes("refresh_token=")
    ) {
      console.log("✅ OAuth tokens detected in URL! Processing...");
      finishUserOAuth(changeInfo.url);
      return;
    }

    // Additional fallback: Check if this is copyandprompt.com with hash containing tokens
    if (
      changeInfo.url.includes("copyandprompt.com") &&
      changeInfo.url.includes("#")
    ) {
      console.log("🔍 Checking copyandprompt.com URL for OAuth tokens...");
      const urlObj = new URL(changeInfo.url);
      if (
        urlObj.hash &&
        (urlObj.hash.includes("access_token=") ||
          urlObj.hash.includes("refresh_token="))
      ) {
        console.log(
          "✅ OAuth tokens found in copyandprompt.com URL! Processing..."
        );
        finishUserOAuth(changeInfo.url);
        return;
      }
    }
  }
});

/**
 * Method used to finish OAuth callback for a user authentication.
 */
async function finishUserOAuth(url) {
  try {
    console.log("🚀 Starting OAuth callback processing...");
    console.log("URL received:", url);

    // extract tokens from hash
    const hashMap = parseUrlHash(url);
    console.log("Parsed hash map:", Object.fromEntries(hashMap));

    const access_token = hashMap.get("access_token");
    const refresh_token = hashMap.get("refresh_token");

    console.log("Access token found:", !!access_token);
    console.log("Refresh token found:", !!refresh_token);

    if (!access_token || !refresh_token) {
      console.error("❌ Missing tokens:", {
        access_token: !!access_token,
        refresh_token: !!refresh_token,
      });
      throw new Error(`no supabase tokens found in URL hash`);
    }

    console.log("✅ Tokens found, setting session...");

    // check if they work
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error("❌ Error setting session:", error);
      throw error;
    }

    console.log("✅ Session set successfully:", data);
    console.log("User data:", data.session?.user);

    // persist session to storage
    console.log("💾 Saving session to chrome storage...");
    await chrome.storage.local.set({ session: data.session });

    // Verify storage
    const stored = await chrome.storage.local.get("session");
    console.log("✅ Session saved to storage:", stored);

    // redirect to our local success page
    console.log("🔄 Redirecting to success page...");
    chrome.tabs.update({ url: chrome.runtime.getURL("success.html") });

    console.log("🎉 OAuth callback completed successfully!");
  } catch (error) {
    console.error("❌ Error in finishUserOAuth:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
}

/**
 * Helper method used to parse the hash of a redirect URL.
 */
function parseUrlHash(url) {
  console.log("🔍 Parsing URL hash:", url);

  try {
    const urlObj = new URL(url);
    console.log("URL object created:", urlObj);
    console.log("Hash:", urlObj.hash);

    if (!urlObj.hash) {
      console.log("No hash found in URL");
      return new Map();
    }

    const hashParts = urlObj.hash.slice(1).split("&");
    console.log("Hash parts:", hashParts);

    const hashMap = new Map(
      hashParts.map((part) => {
        const [name, value] = part.split("=");
        console.log("Parsing part:", { part, name, value });
        return [name, value];
      })
    );

    console.log("Final hash map:", Object.fromEntries(hashMap));
    return hashMap;
  } catch (error) {
    console.error("❌ Error parsing URL hash:", error);
    return new Map();
  }
}

/**
 * Test function for manual OAuth testing
 */
async function testOAuthFlow() {
  console.log("🧪 Testing OAuth flow manually...");

  // Create a mock session for testing
  const mockSession = {
    access_token: "test_access_token",
    refresh_token: "test_refresh_token",
    user: {
      id: "test_user_id",
      email: "test@example.com",
      user_metadata: { full_name: "Test User" },
    },
  };

  try {
    await chrome.storage.local.set({ session: mockSession });
    console.log("✅ Test session saved to storage");

    // Notify popup about the test session
    chrome.runtime.sendMessage({
      type: "SESSION_UPDATED",
      session: mockSession,
    });
  } catch (error) {
    console.error("❌ Error saving test session:", error);
  }
}
