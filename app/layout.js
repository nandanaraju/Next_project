"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import './globals.css';

export default function RootLayout({ children }) {
  // Initialize the login state directly from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    typeof window !== "undefined" && localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    // Add an event listener for storage changes to update state when token changes
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Remove the token and update state
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-teal-100 via-white to-teal-200">
        {/* Header */}
        <header className="bg-teal-500 text-white py-4 shadow-lg">
          <nav className="flex justify-between items-center max-w-7xl mx-auto px-6">
            {/* Logo */}
            <div className="text-2xl font-bold tracking-wide">
              <Link href="/home" className="hover:text-yellow-300">
                Spa Bliss
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6 text-lg font-medium">
              <Link href="/home" className="hover:text-yellow-300">
                Home
              </Link>
              <Link href="/about" className="hover:text-yellow-300">
                About
              </Link>
              <Link href="/contact" className="hover:text-yellow-300">
                Contact Us
              </Link>
              <Link href="/more" className="hover:text-yellow-300">
                More
              </Link>

              {/* Login/Logout Button */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-yellow-300 hover:text-teal-800 transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="bg-white text-teal-600 px-4 py-2 rounded-md hover:bg-yellow-300 hover:text-teal-800 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-teal-500 text-white py-6 text-center">
          <p className="text-sm font-light">
            © 2024 Spa Bliss | Relaxation Redefined. All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
