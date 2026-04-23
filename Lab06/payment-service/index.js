require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8084;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_ordering_payment';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://172.16.48.141:8083';


// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to Payment Service MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// POST /payments
app.post('/payments', async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  try {
    // 1. Process payment logic (simulated)
    const newPayment = new Payment({
      orderId,
      paymentMethod,
      amount: 1000, // Should get from order ideally
      status: 'SUCCESS'
    });
    await newPayment.save();

    // 2. Update order status to PAID
    await axios.put(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, { status: 'PAID' });

    // 3. Send Notification (Console log + REST call simulated)
    console.log(`NOTIFICATION: User for order #${orderId} has successfully paid via ${paymentMethod}`);
    
    res.status(201).json(newPayment);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error during payment processing' });
    }
  }
});

const SERVICE_IP = process.env.SERVICE_IP || '172.16.35.88';

app.listen(PORT, SERVICE_IP, () => {
  console.log(`Payment & Notification Service running at http://${SERVICE_IP}:${PORT}`);
});


