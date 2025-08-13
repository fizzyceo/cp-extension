import React, { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const LoginForm = ({ onGoogleLogin, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef(null);

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
        // Reset captcha on error
        captchaRef.current?.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      console.log("✅ Email login successful:", data);
      setError("");
      onLoginSuccess(data.user);

      // Reset captcha on success
      captchaRef.current?.resetCaptcha();
      setCaptchaToken("");
    } catch (error) {
      console.error("❌ Unexpected login error:", error);
      setError("An unexpected error occurred. Please try again.");
      // Reset captcha on error
      captchaRef.current?.resetCaptcha();
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
        // Reset captcha on error
        captchaRef.current?.resetCaptcha();
        setCaptchaToken("");
        return;
      }

      console.log("✅ OAuth URL generated:", data.url);
      console.log("🔗 Opening new tab with OAuth URL...");

      // Reset captcha on success
      captchaRef.current?.resetCaptcha();
      setCaptchaToken("");

      // Open new tab with Supabase auth URL
      await chrome.tabs.create({ url: data.url });
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      setError("Unexpected error occurred");
      // Reset captcha on error
      captchaRef.current?.resetCaptcha();
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaVerify = (token) => {
    console.log("✅ Captcha verified, token received");
    setCaptchaToken(token);
    setError(""); // Clear any previous captcha errors
  };

  const onCaptchaExpire = () => {
    console.log("⏰ Captcha expired");
    setCaptchaToken("");
    setError("Captcha verification expired. Please try again.");
  };

  const onCaptchaError = (err) => {
    console.error("❌ Captcha error:", err);
    setCaptchaToken("");
    setError("Captcha verification failed. Please try again.");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
        <p className="text-gray-600">Welcome back! Sign in to your account</p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* hCaptcha */}
        <div className="flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey="1c72c670-f5e4-4310-8ed0-34549ed241da"
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={onCaptchaExpire}
            onError={onCaptchaError}
            theme="light"
            size="normal"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading || !captchaToken}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "🔄 Signing in..." : "🔐 Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading || !captchaToken}
        className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
        Sign in with Google
      </button>

      {/* Captcha Status */}
      {captchaToken && (
        <div className="text-center">
          <p className="text-sm text-green-600">✅ Captcha verified</p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
