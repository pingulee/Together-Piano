const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const port = require('./public/javascripts/port')
const ContentType = require('./public/javascripts/contenttype')
const validation = require('./public/javascripts/validation');
const db = require('./public/javascripts/db');

const nameDB = fs.readFileSync('./public/db/name', 'utf8');
const idDB = fs.readFileSync('./public/db/id', 'utf8');
const pwDB = fs.readFileSync('./public/db/pw', 'utf8');
const emailDB = fs.readFileSync('./public/db/email', 'utf8');

const server = http.createServer((request, response) => {
  switch (request.method) {
    case 'GET':
      if (request.url === '/') {
        response.writeHead(200, ContentType.html);
        response.end(fs.readFileSync('./public/index.html', 'utf8'));
      }
      else if (request.url === '/stylesheets/style.css') {
        response.writeHead(200, ContentType.css);
        response.end(fs.readFileSync('./public/stylesheets/style.css', 'utf8'));
      }
      else if (request.url === '/javascripts/script.js') {
        response.writeHead(200, ContentType.js);
        response.end(fs.readFileSync('./public/javascripts/script.js', 'utf8'));
      }
      break;

    case 'POST':
      if (request.url === '/login') {
        response.writeHead(200, ContentType.html);
        response.end(fs.readFileSync('./public/piano.html', 'utf8'));
      }
      else if (request.url === '/join') {
        response.writeHead(200, ContentType.html);
        response.end(fs.readFileSync('./public/join.html', 'utf8'));
      }
      else if (request.url === '/') {
        let body = "";

        request.on('data', (chunk) => {
          body += chunk.toString();
        });
        request.on('end', () => {
          const { name, id, pw1, pw2, email } = querystring.parse(body);

          if (validation.pwCheck(pw1, pw2) && validation.emailCheck(email)) {
            fs.writeFileSync('./public/db/name', `${nameDB}|${name}`);
            fs.writeFileSync('./public/db/id', `${idDB}|${id}`);
            fs.writeFileSync('./public/db/pw', `${pwDB}|${pw1}`);
            fs.writeFileSync('./public/db/email', `${emailDB}|${email}`);

            response.writeHead(200, ContentType.html);
            response.end(fs.readFileSync('./public/piano.html', 'utf8'));
          }
        });
      }
      break;

    default:
      response.writeHead(404, ContentType.html);
      response.end('404 ERROR');
      break;
  }
});

server.listen(port, () => {
  console.log('서버 가동 중 : http://localhost:8080/');
});