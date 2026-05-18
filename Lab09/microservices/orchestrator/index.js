const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const HTTP_TIMEOUT_MS = parseInt(process.env.HTTP_TIMEOUT_MS || '8000', 10);
const http = axios.create({ timeout: HTTP_TIMEOUT_MS });

app.use(bodyParser.json());

const SERVICES = {
  USER: 'http://localhost:3001',
  TOUR: 'http://localhost:3002',
  BOOKING: 'http://localhost:3003',
  PAYMENT: 'http://localhost:3004',
  NOTIFICATION: 'http://localhost:3005'
};

// --- AUTH & USER ---
app.post('/auth/register', async (req, res) => {
  try {
    const response = await http.post(`${SERVICES.USER}/register`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'User Service error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const response = await http.post(`${SERVICES.USER}/login`, req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'User Service error' });
  }
});

// --- TOURS ---
app.get('/tours', async (req, res) => {
  try {
    const response = await http.get(`${SERVICES.TOUR}/tours`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Tour Service error' });
  }
});

app.get('/tours/:id', async (req, res) => {
  try {
    const response = await http.get(`${SERVICES.TOUR}/tours/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Tour Service error' });
  }
});

// --- BOOKINGS & ORCHESTRATION ---

// Simple proxy for booking creation
app.post('/bookings', async (req, res) => {
  const { userId, tourId } = req.body;
  try {
    const tourRes = await http.get(`${SERVICES.TOUR}/tours/${tourId}`);
    const tour = tourRes.data;

    const response = await http.post(`${SERVICES.BOOKING}/bookings`, {
      userId,
      tourId,
      amount: tour.price
    });

    res.status(response.status).json({
      message: 'Booking created. Please proceed to payment.',
      booking: response.data,
      tour
    });
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || { message: 'Booking Service error' }
    );
  }
});

// Full Orchestration for Payment + Notification
app.post('/payments', async (req, res) => {
  const { bookingId } = req.body;
  let step = 'init';
  try {
    // 1. Get Booking details
    step = 'get-booking';
    const bookingRes = await http.get(`${SERVICES.BOOKING}/bookings/${bookingId}`);
    const booking = bookingRes.data;

    // 2. Process Payment
    step = 'call-payment-service';
    const paymentRes = await http.post(`${SERVICES.PAYMENT}/payments`, {
      bookingId: booking.id,
      amount: booking.amount
    });
    const payment = paymentRes.data;

    // 3. Update Booking Status
    step = 'update-booking-status';
    await http.patch(`${SERVICES.BOOKING}/bookings/${booking.id}`, { status: 'Confirmed' });

    // 4. Send Notification
    step = 'send-notification';
    const notifRes = await http.post(`${SERVICES.NOTIFICATION}/notifications`, {
      type: 'Email',
      recipient: `user-${booking.userId}@example.com`,
      message: `Booking successful for Tour ID ${booking.tourId}. Amount: ${booking.amount}`
    });

    res.json({
      message: 'Payment and Confirmation successful',
      bookingId: booking.id,
      payment: payment,
      confirmation: notifRes.data
    });
  } catch (error) {
    // Compensation logic: if payment or later steps fail, we might want to mark booking as failed
    try {
      await http.patch(`${SERVICES.BOOKING}/bookings/${bookingId}`, { status: 'Payment Failed' });
    } catch (e) {}
    console.error('[Orchestrator] /payments failed', {
      step,
      bookingId,
      bookingUrl: `${SERVICES.BOOKING}/bookings/${bookingId}`,
      paymentUrl: `${SERVICES.PAYMENT}/payments`,
      notificationUrl: `${SERVICES.NOTIFICATION}/notifications`,
      error: error.response?.data || error.message
    });
    res.status(error.response?.status || 500).json({
      message: 'Payment orchestration failed',
      step,
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Orchestrator Service running on port ${PORT}`);
});
