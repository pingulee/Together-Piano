const server = http.createServer((request, response) => {
  const dbs = fs.readFileSync('./public/db/db.db', 'utf8');
  let body = '';

  const sendResponse = (statusCode, contentType, data) => {
    response.writeHead(statusCode, contentType);
    response.end(data);
  };

  const readFileAndRespond = (filePath, contentType) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        sendResponse(500, ContentType.html, 'Internal Server Error');
      } else {
        sendResponse(200, contentType, data);
      }
    });
  };

  switch (request.method) {
    case 'GET':
      if (request.url === '/') {
        readFileAndRespond('./public/index.html', ContentType.html);
      } else if (request.url === '/stylesheets/style.css') {
        readFileAndRespond('./public/stylesheets/style.css', ContentType.css);
      } else if (request.url === '/javascripts/script.js') {
        readFileAndRespond('./public/javascripts/script.js', ContentType.js);
      }
      break;

    case 'POST':
      if (request.url === '/login') {
        let body = '';

        request.on('data', (chunk) => {
          body += chunk.toString();
        });

        request.on('end', () => {
          const { id, pw } = querystring.parse(body);

          if (loginValidation.check(id, pw, dbs)) {
            readFileAndRespond('./public/piano.html', ContentType.html);
          }
        });
      } else if (request.url === '/create') {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk.toString();
        });

        request.on('end', () => {
          const { name, id, pw1, pw2, email } = querystring.parse(body);

          if (joinValidation.pwCheck(pw1, pw2) && joinValidation.emailCheck(email)) {
            fs.writeFileSync('./public/db/db.db', `${dbs}|${name},${id},${pw1},${email}`);
            readFileAndRespond('./public/index.html', ContentType.html);
          }
        });
      } else if (request.url === '/join') {
        readFileAndRespond('./public/join.html', ContentType.html);
      }
      break;

    default:
      sendResponse(404, ContentType.html, '404 ERROR');
      break;
  }
});

server.listen(port, () => {
  console.log('서버 가동 중 : http://localhost:8080/');
});