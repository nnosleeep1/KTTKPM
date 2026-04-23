require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8081;
const SECRET_KEY = process.env.SECRET_KEY || 'my-secret-key';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_ordering_user';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to User Service MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'USER' }
});

const User = mongoose.model('User', userSchema);

// Basic Seeding
const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create([
      { username: 'admin', password: 'password', role: 'ADMIN' },
      { username: 'user1', password: 'password', role: 'USER' }
    ]);
    console.log('User Service: Seed data created');
  }
};
seedUsers();


// POST /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Username already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user' });
    }
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY);
      res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
});

// GET /users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Internal validation endpoint for Order Service
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

const SERVICE_IP = process.env.SERVICE_IP || '172.16.54.78';

app.listen(PORT, SERVICE_IP, () => {
  console.log(`User Service running at http://${SERVICE_IP}:${PORT}`);
});


