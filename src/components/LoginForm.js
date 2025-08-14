import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const LoginForm = ({ onGoogleLogin, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [isHcaptchaLoaded, setIsHcaptchaLoaded] = useState(false);
  const captchaRef = useRef(null);

  useEffect(() => {
    // Check if hCaptcha is already loaded (injected via HTML)
    const checkHcaptcha = setInterval(() => {
      if (window.hcaptcha) {
        setIsHcaptchaLoaded(true);
        clearInterval(checkHcaptcha);
      }
    }, 100); // Poll every 100ms

    // Fallback: Load script manually if not injected
    if (
      !document.querySelector(
        `script[src="${chrome.runtime.getURL("js/hcaptcha-api.js")}"]`
      )
    ) {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("js/hcaptcha-api.js");
      script.async = true;
      script.onload = () => {
        console.log("hCaptcha script loaded successfully");
        if (window.hcaptcha) {
          setIsHcaptchaLoaded(true);
          clearInterval(checkHcaptcha);
        } else {
          console.error("hCaptcha global object not found");
          setError("Failed to initialize captcha.");
        }
      };
      script.onerror = () => {
        console.error("Failed to load hCaptcha script");
        setError("Failed to load captcha. Please try again later.");
        clearInterval(checkHcaptcha);
      };
      document.head.appendChild(script);
    }

    // Cleanup
    return () => clearInterval(checkHcaptcha);
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha verification");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🔐 Attempting email/password login with captcha...");
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
        options: {
          captchaToken: captchaToken,
        },
      });

      if (error) {
        console.error("❌ Login error:", error);
        setError(error.message);
        captchaRef.current.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      console.log("✅ Email login successful:", data);
      setError("");
      onLoginSuccess(data.user);
      captchaRef.current.resetCaptcha();
      setCaptchaToken("");
    } catch (error) {
      console.error("❌ Unexpected login error:", error);
      setError("An unexpected error occurred. Please try again.");
      captchaRef.current.resetCaptcha();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!captchaToken) {
      setError("Please complete the captcha verification");
      return;
    }

    try {
      console.log("🚀 Starting Google OAuth login with captcha...");
      setLoading(true);
      setError("");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: chrome.identity.getRedirectURL(),
          captchaToken: captchaToken,
        },
      });

      if (error) {
        console.error("❌ Error signing in with Google:", error.message);
        setError("Error signing in with Google: " + error.message);
        captchaRef.current.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      console.log("✅ OAuth URL generated:", data.url);
      console.log("🔗 Opening new tab with OAuth URL...");
      captchaRef.current.resetCaptcha();
      setCaptchaToken("");
      await chrome.tabs.create({ url: data.url });
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      setError("Unexpected error occurred");
      captchaRef.current.resetCaptcha();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    if (!captchaToken) {
      setError("Please complete the captcha verification");
      return;
    }

    try {
      console.log("🚀 Starting LinkedIn OAuth login with captcha...");
      setLoading(true);
      setError("");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: chrome.identity.getRedirectURL(),
          captchaToken: captchaToken,
        },
      });

      if (error) {
        console.error("❌ Error signing in with LinkedIn:", error.message);
        setError("Error signing in with LinkedIn: " + error.message);
        captchaRef.current.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      console.log("✅ OAuth URL generated:", data.url);
      console.log("🔗 Opening new tab with OAuth URL...");
      captchaRef.current.resetCaptcha();
      setCaptchaToken("");
      await chrome.tabs.create({ url: data.url });
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      setError("Unexpected error occurred");
      captchaRef.current.resetCaptcha();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 p-6 w-[480px] max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
        <p className="text-gray-600 text-sm">
          Sign in to your Copy&Prompt account
        </p>
      </div>

      {/* Social Login Buttons - In One Row */}
      <div className="flex space-x-3">
        <button
          onClick={handleGoogleLogin}
          disabled={loading || !captchaToken}
          className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-3 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
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
          <span className="text-sm">Google</span>
        </button>

        <button
          onClick={handleLinkedInLogin}
          disabled={loading || !captchaToken}
          className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2.5 px-3 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
          <span className="text-sm">LinkedIn</span>
        </button>
      </div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Captcha */}
        <div className="flex justify-center">
          {isHcaptchaLoaded ? (
            <HCaptcha
              ref={captchaRef}
              sitekey="1c72c670-f5e4-4310-8ed0-34549ed241da"
              onVerify={setCaptchaToken}
              onExpire={() => {
                setCaptchaToken("");
                setError("Captcha verification expired. Please try again.");
                captchaRef.current.resetCaptcha();
              }}
              onError={() => {
                setCaptchaToken("");
                setError("Captcha verification failed. Please try again.");
                captchaRef.current.resetCaptcha();
              }}
              theme="light"
              size="normal"
            />
          ) : (
            <div className="text-center text-red-600">Loading captcha...</div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading || !captchaToken}
          className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span>Sign in</span>
        </button>
      </form>

      {captchaToken && (
        <div className="text-center">
          <p className="text-sm text-green-600">✅ Captcha verified</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
