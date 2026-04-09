const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017';
const dbName = process.env.MONGO_DB || 'mydb';

app.use(express.json());

let notesCollection;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/notes', async (req, res) => {
  const notes = await notesCollection.find({}).toArray();
  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }

  const result = await notesCollection.insertOne({
    title,
    content: content || '',
    createdAt: new Date(),
  });

  res.status(201).json({ insertedId: result.insertedId });
});

app.get('/notes/:id', async (req, res) => {
  const note = await notesCollection.findOne({ _id: new ObjectId(req.params.id) });
  if (!note) {
    return res.status(404).json({ message: 'note not found' });
  }
  res.json(note);
});

async function startServer() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  notesCollection = client.db(dbName).collection('notes');

  app.listen(port, () => {
    console.log(`Node.js app listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
