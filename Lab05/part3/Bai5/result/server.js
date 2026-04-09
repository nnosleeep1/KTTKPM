const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'db',
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'votes',
});

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT option, total FROM results ORDER BY option');
  const rows = result.rows
    .map((row) => `<li>${row.option}: ${row.total}</li>`)
    .join('');

  res.send(`
    <h1>Voting Results</h1>
    <ul>${rows}</ul>
    <p><a href="http://vote:5000">Back to vote</a></p>
  `);
});

app.listen(port, () => {
  console.log(`Result service running on port ${port}`);
});
