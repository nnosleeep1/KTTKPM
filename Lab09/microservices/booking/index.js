const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(bodyParser.json());

const bookings = [];

app.post('/bookings', (req, res) => {
  const { userId, tourId, amount } = req.body;
  const newBooking = {
    id: bookings.length + 1,
    userId,
    tourId,
    amount,
    status: 'Pending',
    createdAt: new Date()
  };
  bookings.push(newBooking);
  console.log(`[Booking Service] Booking created: ID ${newBooking.id}`);
  res.status(201).json(newBooking);
});

app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id, 10));
  if (booking) {
    res.json(booking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

app.patch('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (booking) {
    const { status } = req.body;
    booking.status = status;
    console.log(`[Booking Service] Booking ID ${booking.id} updated to ${status}`);
    res.json(booking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`);
});
