require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8082;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_ordering_food';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to Food Service MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Food Schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }
});

const Food = mongoose.model('Food', foodSchema);

// Basic Seeding
const seedFoods = async () => {
  const count = await Food.countDocuments();
  if (count === 0) {
    await Food.create([
      { name: 'Bánh Mì', price: 20000, description: 'Traditional Vietnamese Bread' },
      { name: 'Phở', price: 50000, description: 'Traditional Vietnamese Noodle Soup' },
      { name: 'Cơm Tấm', price: 35000, description: 'Broken Rice with Grilled Pork' }
    ]);
    console.log('Food Service: Seed data created');
  }
};
seedFoods();


// GET /foods
app.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foods' });
  }
});

// POST /foods
app.post('/foods', async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const newFood = new Food({ name, price, description });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Error creating food' });
  }
});

// PUT /foods/:id
app.put('/foods/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedFood) {
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating food' });
  }
});

// DELETE /foods/:id
app.delete('/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (deletedFood) {
      res.json(deletedFood);
    } else {
      res.status(404).json({ message: 'Food not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food' });
  }
});

// Internal lookup by ID for Order Service
// app.get('/foods/:id', async (req, res) => {
//   try {
//     const food = await Food.findById(req.params.id);
//     if (food) {
//       res.json(food);
//     } else {
//       res.status(404).json({ message: 'Food not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching food' });
//   }
// });


app.get('/foods/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid food ID' });
    }

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    res.json(food);
  } catch (error) {
    console.error(error); // 🔥 ADD THIS
    res.status(500).json({ message: 'Error fetching food' });
  }
});

const SERVICE_IP = process.env.SERVICE_IP || '172.16.48.24';

app.listen(PORT, SERVICE_IP, () => {
  console.log(`Food Service running at http://${SERVICE_IP}:${PORT}`);
});


