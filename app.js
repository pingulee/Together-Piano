const http = require('http');
const fs = require('fs');
const ContentType = require('./public/javascripts/contenttype');

const server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.url === '/') {
        res.writeHead(200, ContentType.html);
        res.end(fs.readFileSync('./public/index.html', 'utf8'));
      } else if (req.url === '/stylesheets/style.css') {
        res.writeHead(200, ContentType.css);
        res.end(fs.readFileSync('./public/stylesheets/style.css', 'utf8'));
      } else if (req.url === '/stylesheets/piano.css') {
        res.writeHead(200, ContentType.css);
        res.end(fs.readFileSync('./public/stylesheets/piano.css', 'utf8'));
      } else if (req.url === '/javascripts/script.js') {
        res.writeHead(200, ContentType.js);
        res.end(fs.readFileSync('./public/javascripts/script.js', 'utf8'));
      } else if (req.url === '/sounds/a5.mp3') {
        res.writeHead(200, ContentType.mpeg);
        res.end(fs.readFileSync('./public/sounds/a5.mp3', 'utf8'));
      } else {
        res.writeHead(404, ContentType.plain);
        res.end('Not Found');
      }
      break;

    default:
      res.writeHead(404, ContentType.plain);
        res.end('Not Found');
      break;
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});