const http = require('http');
const { getMessage } = require('./src/app');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(getMessage());
});

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});
