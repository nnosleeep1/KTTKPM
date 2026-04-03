const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from Multi-stage Docker Node.js!');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
