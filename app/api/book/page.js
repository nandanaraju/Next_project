const express = require('express');
const dbConnect = require('../../lib/dbConnect'); // Import database connection
const Booking = require('../../models/book'); // Import Booking model
const User = require('../../models/User'); // Import User model

const router = express.Router();

// Middleware to verify if the user exists
const verifyUser = async (req, res, next) => {
  const userId = req.body?.userId || req.query?.userId || req.headers['user-id']; // Extract userId from request

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await dbConnect(); // Ensure the database is connected
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user; // Attach user information to the request
    next();
  } catch (error) {
    console.error('Error verifying user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Async error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Get Bookings
router.get('/', verifyUser, asyncHandler(async (req, res) => {
  await dbConnect(); // Ensure the database is connected
  const bookings = await Booking.find({ userId: req.user._id });
  res.json(bookings);
}));

// Add Booking
router.post('/add-book', verifyUser, asyncHandler(async (req, res) => {
  const { service, date } = req.body;

  if (!service || !date) {
    return res.status(400).json({ error: 'Service and date are required' });
  }

  await dbConnect(); // Ensure the database is connected
  const booking = new Booking({ userId: req.user._id, service, date });
  await booking.save();
  res.status(201).json(booking);
}));

// Delete Booking
router.delete('/:id', verifyUser, asyncHandler(async (req, res) => {
  await dbConnect(); // Ensure the database is connected
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  // Ensure the user deleting the booking owns it
  if (booking.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'Unauthorized action' });
  }

  await booking.deleteOne();
  res.json({ message: 'Booking deleted successfully' });
}));

// Error handler for unhandled routes
router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;