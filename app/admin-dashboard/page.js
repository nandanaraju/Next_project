"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const user = JSON.parse(atob(token.split(".")[1]));
        if (user.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    validateAdmin();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return null;

  return (
    <>
      <Head>
        <title>SPA Booking Dashboard</title>
        <meta name="description" content="SPA Booking Management" />
      </Head>

      {/* Full Page Layout */}
      <div className="min-h-screen flex bg-gray-50 text-gray-800">
        {/* Sidebar */}
        <div className="w-64 bg-teal-700 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">SPA Admin</h2>
          <ul className="space-y-4">
            <li className="hover:bg-teal-600 p-2 rounded">
              <a href="#" className="block">Dashboard</a>
            </li>
            <li className="hover:bg-teal-600 p-2 rounded">
              <a href="#" className="block">Manage Bookings</a>
            </li>
            <li className="hover:bg-teal-600 p-2 rounded">
              <a href="#" className="block">Manage Services</a>
            </li>
            <li className="hover:bg-teal-600 p-2 rounded">
              <a href="#" className="block">Customer Feedback</a>
            </li>
            <li className="hover:bg-teal-600 p-2 rounded">
              <button onClick={logout} className="w-full text-left">Logout</button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-teal-700">SPA Booking Dashboard</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-teal-500">
              <h3 className="text-gray-600 text-lg mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-teal-700">450</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-gray-600 text-lg mb-2">Active Services</h3>
              <p className="text-3xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-gray-600 text-lg mb-2">Pending Feedback</h3>
              <p className="text-3xl font-bold text-yellow-600">25</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-gray-600 text-lg mb-2">Canceled Appointments</h3>
              <p className="text-3xl font-bold text-red-600">8</p>
            </div>
          </div>

          {/* Booking Overview */}
          <div className="bg-white mt-8 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">Recent Bookings</h2>
            <ul className="space-y-2">
              <li className="flex justify-between border-b py-2">
                <span className="text-gray-600">Jane Doe - Full Body Massage</span>
                <span className="font-bold text-teal-600">Confirmed</span>
              </li>
              <li className="flex justify-between border-b py-2">
                <span className="text-gray-600">John Smith - Facial Treatment</span>
                <span className="font-bold text-yellow-500">Pending</span>
              </li>
              <li className="flex justify-between border-b py-2">
                <span className="text-gray-600">Anna Lee - Hot Stone Therapy</span>
                <span className="font-bold text-red-500">Canceled</span>
              </li>
            </ul>
          </div>

          {/* Feedback Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-teal-100 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-teal-700">Customer Feedback</h2>
              <p className="text-gray-700">
                “The full-body massage was amazing! The staff was super professional.”
              </p>
              <p className="mt-2 text-sm text-gray-500">- Sarah M.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-teal-700">Most Booked Service</h2>
              <p className="text-3xl font-bold text-teal-600">Full Body Massage</p>
              <p className="text-gray-500 mt-2">Total Bookings: 150</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
