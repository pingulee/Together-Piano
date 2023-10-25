const port = 8080;

const http = require('http');
const fs = require('fs');
const ContentType = require('./public/javascripts/contenttype');

const server = http.createServer((req, res) => {
  const routes = {
    '/': 'index.html',
    '/stylesheets/style.css': 'stylesheets/style.css',
    '/stylesheets/piano.css': 'stylesheets/piano.css',
    '/javascripts/script.js': 'javascripts/script.js',
    '/javascripts/piano.js': 'javascripts/piano.js',
    '/sounds/c5.mp3': 'sounds/c5.mp3',
    '/sounds/cs5.mp3': 'sounds/cs5.mp3',
    '/sounds/d5.mp3': 'sounds/d5.mp3',
    '/sounds/ds5.mp3': 'sounds/ds5.mp3',
    '/sounds/e5.mp3': 'sounds/e5.mp3',
    '/sounds/f5.mp3': 'sounds/f5.mp3',
    '/sounds/fs5.mp3': 'sounds/fs5.mp3',
    '/sounds/g5.mp3': 'sounds/g5.mp3',
    '/sounds/gs5.mp3': 'sounds/gs5.mp3',
    '/sounds/a5.mp3': 'sounds/a5.mp3',
    '/sounds/as5.mp3': 'sounds/as5.mp3',
    '/sounds/b5.mp3': 'sounds/b5.mp3',
  };

  if (routes[req.url]) {
    const filePath = `./public/${routes[req.url]}`;
    const contentType = ContentType[filePath.split('.').pop()] || ContentType.plain;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, ContentType.plain);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, contentType);
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, ContentType.plain);
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});