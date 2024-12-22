'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings');
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      alert('Error deleting booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-teal-200 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-green-400 text-white py-6 px-8">
          <h1 className="text-3xl font-bold">Your Bookings</h1>
          <p className="text-sm font-light">
            Manage your spa appointments with ease.
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Add Booking Button */}
          <Link
            href="/bookings/add"
            className="inline-block bg-teal-500 text-white font-bold py-2 px-6 rounded-md mb-6 shadow hover:bg-teal-600 transition duration-200"
          >
            Add Booking
          </Link>

          {/* Booking List */}
          {bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className="flex justify-between items-center bg-gradient-to-r from-teal-100 to-teal-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="text-gray-800 font-medium text-lg">
                      {booking.service}
                    </p>
                    <p className="text-gray-500 text-sm">{booking.date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center py-10 text-lg">
              No bookings available. Start by adding a new booking!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
