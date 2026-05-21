const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

const tours = [
  { id: 101, name: 'Da Lat 3 days', price: 2000000, slots: 10 },
  { id: 102, name: 'Ha Long Bay 2 days', price: 3500000, slots: 5 }
];

app.get('/tours', (req, res) => {
  res.json(tours);
});

app.get('/tours/:id', (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  if (tour) {
    res.json(tour);
  } else {
    res.status(404).json({ message: 'Tour not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Tour Service running on port ${PORT}`);
});
