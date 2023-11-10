const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const routes = require('./routes');

const port = 8080;

app.use('/', routes);

server.listen(port, () => {
  console.log(`http://localhost:8080`);
});