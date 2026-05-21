const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(bodyParser.json());

app.post('/payments', (req, res) => {
  const { bookingId, amount } = req.body;
  console.log(`[Payment Service] Processing payment for Booking ID ${bookingId}, amount: ${amount}`);
  const isSuccess = Math.random() > 0.1;
  if (isSuccess) {
    res.json({ status: 'Success', transactionId: `TXN-${Date.now()}` });
  } else {
    res.status(400).json({ status: 'Failed', message: 'Insufficient funds' });
  }
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});
