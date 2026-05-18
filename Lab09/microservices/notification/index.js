const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(bodyParser.json());

app.post('/notifications', (req, res) => {
  const { type, recipient, message } = req.body;
  console.log(`[Notification Service] Sending ${type} to ${recipient}: ${message}`);
  res.json({ status: 'Sent' });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
