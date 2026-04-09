const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydb',
  port: Number(process.env.DB_PORT || 3306),
};

app.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query('SELECT NOW() AS nowTime');
    await connection.end();
    res.send(`Connected to MySQL. Server time: ${rows[0].nowTime}`);
  } catch (error) {
    res.status(500).send(`MySQL connection failed: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`);
});
