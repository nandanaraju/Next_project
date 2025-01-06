// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/appointments', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Booking Schema
const BookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  service: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  userId: { type: String, required: true }, // New field
});


const Booking = mongoose.model('Booking', BookingSchema);

// Routes
// GET /appointments: Fetch all appointments
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Booking.find();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send('Internal server error');
  }
});

// POST /submit-booking: Create or modify an appointment
app.post('/submit-booking', async (req, res) => {
  const { name, phone, service, time, date, notes } = req.body;

  try {
    const existingBooking = await Booking.findOne({ phone });

    if (existingBooking) {
      // Update existing appointment
      existingBooking.service = service;
      existingBooking.time = time;
      existingBooking.date = date;
      existingBooking.notes = notes;
      await existingBooking.save();

      res.send('Appointment updated successfully!');
    } else {
      // Add new appointment
      const newBooking = new Booking({ name, phone, service, time, date, notes });
      await newBooking.save();

      res.send('Appointment booked successfully!');
    }
  } catch (error) {
    console.error('Error handling booking:', error);
    res.status(500).send('Internal server error');
  }
});

// POST /modify-appointment: Modify an existing appointment
app.post('/modify-appointment', async (req, res) => {
  const { phone, service, time, date, notes } = req.body;

  try {
    const appointment = await Booking.findOne({ phone });

    if (appointment) {
      appointment.service = service;
      appointment.time = time;
      appointment.date = date;
      appointment.notes = notes;
      await appointment.save();

      res.send('Appointment modified successfully!');
    } else {
      res.status(404).send('Appointment not found!');
    }
  } catch (error) {
    console.error('Error modifying appointment:', error);
    res.status(500).send('Internal server error');
  }
});

// POST /cancel-appointment: Cancel an appointment
app.post('/cancel-appointment', async (req, res) => {
  const { phone } = req.body;

  try {
    const result = await Booking.deleteOne({ phone });

    if (result.deletedCount > 0) {
      res.send('Appointment cancelled successfully!');
    } else {
      res.status(404).send('Appointment not found!');
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).send('Internal server error');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
