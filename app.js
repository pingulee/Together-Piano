const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const port = require('./public/javascripts/port')
const ContentType = require('./public/javascripts/contenttype')
const signUpAsset = require('./public/javascripts/signUpAsset');
const validation = require('./public/javascripts/validation');
const db = require('./public/javascripts/db');



const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, ContentType.html);
    response.end(fs.readFileSync('./public/index.html', 'utf8'));
  }

  else if (request.method === 'GET' && request.url === '/stylesheets/style.css') {
    response.writeHead(200, ContentType.css);
    response.end(fs.readFileSync('./public/stylesheets/style.css', 'utf8'));
  }

  else if (request.method === 'GET' && request.url === '/javascripts/script.js') {
    response.writeHead(200, ContentType.js);
    response.end(fs.readFileSync('./public/javascripts/script.js', 'utf8'));
  }

  else if (request.method === 'POST' && request.url === '/login') {
    let body = "";

    request.on('data', (chunk) => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const { id, pw1, pw2, email } = querystring.parse(body);
      const data = db.one + id + db.two;
      fs.writeFileSync('./public/success.html', data)
      if (validation(id, pw1, pw2, email)) {
        signUpAsset.id = id;
        signUpAsset.pw = pw1;
        signUpAsset.email = email;
        response.writeHead(200, ContentType.html);
        response.end(fs.readFileSync('./public/success.html', 'utf8'));
      } else {
        response.end(fs.readFileSync('./public/index.html', 'utf8'));
      }
    });
  }

  else if (request.method === 'POST' && request.url === '/send') {
    let body = "";
    response.writeHead(200, ContentType.html);
    request.on('data', (chunk) => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const { title, text } = querystring.parse(body);
      console.log(`제목: ${title}`);
      console.log(`내용: ${text}`);
    });
    response.end(fs.readFileSync('./public/index.html', 'utf8'));
  }

  else {
    response.writeHead(404, ContentType.html);
    response.end('404 ERROR');
  }
});

server.listen(port, () => {
  console.log('서버 가동 중 : http://localhost:8080/');
});