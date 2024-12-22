"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // Store the user role (admin or user)

        setMessage("Login successful!");

        // Redirect based on the user role
        if (data.role === "admin") {
          router.push("/admin-dashboard"); // Redirect to admin dashboard
        } else {
          router.push("/home"); // Redirect to home for normal users
        }
      } else {
        // Handle failed login
        setMessage(data.message || "Failed to log in");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
        'url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?fit=crop&w=1920&q=80")',
      }}
    >
      {/* Semi-transparent overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md  backdrop-blur-md rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Message */}
          {message && (
            <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 hover:shadow-lg transition duration-300"
          >
            Log In
          </button>

          {/* Signup Link */}
          <div className="mt-4 text-center text-sm text-white">
            <p>
              Don't have an account?{" "}
              <a href="/" className="text-teal-500 hover:underline">
                Create one here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
