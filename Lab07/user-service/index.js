const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const amqp = require('amqplib');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_user_db';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const SECRET_KEY = 'movie-secret-key';

// (MongoDB connection will be established after model/seed setup below)

// RabbitMQ Connection
let channel;
async function connectRabbitMQ() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();
    console.log('User Service: Connected to RabbitMQ');
  } catch (error) {
    console.error('RabbitMQ connection error. Retrying in 5s...', error.message);
    setTimeout(connectRabbitMQ, 5000);
  }
}
connectRabbitMQ();

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Initial Seed
const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('password', 10);
      await User.create([
        { username: 'admin', password: hashedPassword },
        { username: 'user1', password: hashedPassword }
      ]);
      console.log('User Service: Seed data created (admin, user1)');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};

// Robust MongoDB connection with retry/backoff and seeding after connect
async function connectWithRetry(retries = 0) {
  try {
    console.log('Attempting MongoDB connection to', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('User Service: Connected to MongoDB');
    await seedUsers();
  } catch (err) {
    const delay = Math.min(30000, 5000 + retries * 5000);
    console.error(`MongoDB connection error: ${err.message}. Retrying in ${delay/1000}s...`);
    setTimeout(() => connectWithRetry(retries + 1), delay);
  }
}

connectWithRetry();

// POST /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // Publish Event
    if (channel) {
      const event = { type: 'USER_REGISTERED', payload: { userId: user._id, username: user.username } };
      channel.assertExchange('movie_events', 'topic', { durable: false });
      channel.publish('movie_events', 'user.registered', Buffer.from(JSON.stringify(event)));
      console.log('Published USER_REGISTERED event');
    }

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`User Service running on port ${PORT}`);
});
