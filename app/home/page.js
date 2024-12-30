'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ service: '', date: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
      } else {
        alert('Error deleting booking');
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Error deleting booking');
    }
  };

  const handleAddBooking = async () => {
    try {
      const response = await fetch('/api/add-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      });

      if (response.ok) {
        const data = await response.json();
        setBookings([...bookings, data]);
        setShowModal(false);
        setNewBooking({ service: '', date: '' });
      } else {
        alert('Error adding booking');
      }
    } catch (err) {
      console.error('Error adding booking:', err);
      alert('Error adding booking');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 via-white to-teal-200 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-green-400 text-white py-6 px-8">
          <h1 className="text-3xl font-bold">Your Bookings</h1>
          <p className="text-sm font-light">Manage your spa appointments with ease.</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Add Booking Button */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-block bg-teal-500 text-white font-bold py-2 px-6 rounded-md mb-6 shadow hover:bg-teal-600 transition duration-200"
          >
            Add Booking
          </button>

          {/* Booking List */}
          {bookings.length > 0 ? (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className="flex justify-between items-center bg-gradient-to-r from-teal-100 to-teal-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="text-gray-800 font-medium text-lg">{booking.service}</p>
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

      {/* Modal for Adding Booking */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Booking</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
              <input
                type="text"
                value={newBooking.service}
                onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter service name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBooking}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
