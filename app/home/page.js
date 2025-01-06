'use client';
import { useState, useEffect } from 'react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: '',
    time: '',
    date: '',
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch('/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isUpdating ? '/modify-appointment' : '/submit-booking';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const message = await res.text();
      alert(message);
      fetchAppointments();
      setForm({
        name: '',
        phone: '',
        service: '',
        time: '',
        date: '',
        notes: '',
      });
      setIsUpdating(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle appointment update
  const handleUpdate = (appointment) => {
    setForm(appointment);
    setIsUpdating(true);
  };

  // Handle appointment cancel
  const handleCancel = async (phone) => {
    try {
      const res = await fetch('/cancel-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const message = await res.text();
      alert(message);
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
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
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 flex flex-col w-full max-w-3xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Manage Appointments
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <input
            type="text"
            name="service"
            placeholder="Service"
            value={form.service}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <input
            type="time"
            name="time"
            placeholder="Time"
            value={form.time}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            required
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          ></textarea>
          <button
            type="submit"
            className="w-full py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:brightness-110 transition duration-300"
          >
            {isUpdating ? 'Update' : 'Add'} Appointment
          </button>
        </form>

        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Appointments</h2>
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <strong className="block text-lg font-bold text-gray-700">
                {appt.name}
              </strong>
              <p className="text-sm text-gray-600">
                {appt.service} on {new Date(appt.date).toLocaleDateString()} at {appt.time}
              </p>
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => handleUpdate(appt)}
                  className="px-4 py-2 bg-teal-500 text-white font-medium rounded-lg shadow-md hover:bg-teal-600 transition"
                >
                  Update
                </button>
                <button
                  onClick={() => handleCancel(appt.phone)}
                  className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
