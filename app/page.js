"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        setMessage("Signup successful!");

        if (data.role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/login");
        }
      } else {
        setMessage(data.message || "Failed to sign up");
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
      {/* Background Overlay */}
      <div className=" "></div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl  shadow-xl rounded-lg overflow-hidden">
        {/* Left Section - Signup Form */}
        <div className="flex-1 p-8 lg:p-12  backdrop-blur-lg">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Create Your Account
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

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-white mb-2"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Message */}
            {message && (
              <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-semibold rounded-lg shadow-md  transition duration-300"
            >
              Sign Up
            </button>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm text-white">
              <p>
                Already have an account?{" "}
                <a href="/login" className="text-black hover:underline">
                  Log in here
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Right Section - Promotional Content */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12  text-white text-center">
          <h1 className="text-5xl font-extrabold mb-4">Relax. Rejuvenate. Refresh.</h1>
          <p className="text-lg max-w-md mb-8">
            Join our wellness community and enjoy exclusive spa treatments and
            services that rejuvenate your mind, body, and soul.
          </p>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:brightness-110 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
