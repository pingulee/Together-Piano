const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/hello') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found\n');
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});