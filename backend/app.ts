import express from 'express';
import http from 'http';
import socket from './socket';

const port = 3288;

const app = express();
const server = http.createServer(app);

socket(server);
server.listen(port, () => console.log(`Port : ${port}`));
