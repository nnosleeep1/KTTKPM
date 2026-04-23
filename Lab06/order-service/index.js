require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8083;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_ordering_order';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://172.16.54.78:8081';
const FOOD_SERVICE_URL = process.env.FOOD_SERVICE_URL || 'http://172.16.48.24:8082';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to Order Service MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  foodId: { type: String, required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// POST /orders
app.post('/orders', async (req, res) => {
  const { userId, foodId, quantity } = req.body;

  try {
    // 1. Validate user via User Service
    await axios.get(`${USER_SERVICE_URL}/users/${userId}`);

    // 2. Get food details via Food Service
    const foodResponse = await axios.get(`${FOOD_SERVICE_URL}/foods/${foodId}`);
    const food = foodResponse.data;

    // 3. Create order
    const newOrder = new Order({
      userId,
      foodId,
      foodName: food.name,
      quantity,
      totalPrice: food.price * quantity,
      status: 'PENDING'
    });
    await newOrder.save();

    console.log(`Order created: ${newOrder._id} for user ${userId}`);
    res.status(201).json(newOrder);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: 'User or Food not found' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error during order creation' });
    }
  }
});

// GET /orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// PUT /orders/:id/status (Internal endpoint for Payment Service)
app.put('/orders/:id/status', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

const SERVICE_IP = process.env.SERVICE_IP || '172.16.48.141';

app.listen(PORT, SERVICE_IP, () => {
  console.log(`Order Service running at http://${SERVICE_IP}:${PORT}`);
});


