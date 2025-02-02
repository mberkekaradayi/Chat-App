"use client";
import { useState } from "react";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import axios from "axios";

export default function Signup() {
  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State for error handling and success status
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignup = async (e) => {
    // Clear any previous error messages
    setError("");
    e.preventDefault();

    // Validate that all required fields are filled
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Verify that password and confirmation match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Attempt to register the user by sending credentials to the backend
      const response = await axios.post(
        "http://localhost:3001/auth/register",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      // If registration is successful, update UI to show success state
      setIsSuccess(true);
    } catch (error) {
      // Handle different types of registration errors
      if (error.response) {
        // Display server-provided error message or default to duplicate user message
        setError(error.response.data.message || "User is already registered.");
      } else {
        // Display generic error for network/connection issues
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
      {/* Home Button */}
      <div className="absolute top-7 left-7 flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-400 hover:text-gray-100 transition"
        >
          <FaHome size={24} />
          <span className="font-semibold text-base">Home</span>
        </Link>
      </div>

      {isSuccess ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-500">
            Account Created Successfully!
          </h2>
          <p className="text-slate-300 mt-2">
            You can now{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Log In
            </Link>
            .
          </p>
        </div>
      ) : (
        // old version
        // <div className="text-center">
        //   <h2 className="text-2xl font-bold text-green-500">
        //     Account Created Successfully!
        //   </h2>
        //   <p className="text-slate-300 mt-2">
        //     You can now{" "}
        //     <Link
        //       href="/login"
        //       className="text-blue-500 hover:underline font-medium"
        //     >
        //       Log In
        //     </Link>
        //     .
        //   </p>
        // </div>
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">📝 Sign Up</h1>
          {error && (
            <div className="bg-red-800 text-white p-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
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
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-slate-300"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="w-full p-3 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-green-700 rounded-lg font-semibold hover:bg-green-900 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-500 hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
