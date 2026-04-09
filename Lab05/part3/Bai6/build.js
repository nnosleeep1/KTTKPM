const fs = require('fs');
const path = require('path');
const { getMessage } = require('./src/app');

const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>CI/CD Demo</title>
  </head>
  <body>
    <h1>${getMessage()}</h1>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), html);
