"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Login() {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Next.js router
  const router = useRouter();

  const handleLogin = async (e) => {
    setError("");
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // sent a post request to the server with the email and password
      const response = await axios.post(
        "http://localhost:3001/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // console.log({ response: response.data });
      // set the isLoggingIn state to true
      setIsLoggedIn(true);
    } catch (error) {
      // handle errors
      if (error.response) {
        setError(error.response.data.message || "Invalid login credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  // Redirect after successful login
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        router.push(`/chat?email=${email}`);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isLoggedIn, email, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
      {/* Home Logo */}
      <div className="absolute top-7 left-7 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-400 hover:text-gray-100 transition"
        >
          <FaHome size={24} />
          <span className="font-semibold text-lg">Home</span>
        </Link>
      </div>

      {/* Conditional Rendering: Form or Success Message */}
      {isLoggedIn ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-4">🎉 Welcome!</h1>
          <p className="text-lg text-slate-300 mb-6">
            Hi <span className="font-semibold text-blue-400">{email}</span>, you
            are successfully logged in.
          </p>
          <p className="text-slate-400">Redirecting to chat...</p>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">🔑 Login</h1>
          {/* Error message */}
          {error && (
            <div className="bg-red-800 text-white p-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-700 rounded-lg font-semibold hover:bg-blue-900 transition"
            >
              Log In
            </button>
          </form>
          {/* Signup link*/}
          <p className="text-sm text-center mt-4 text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
