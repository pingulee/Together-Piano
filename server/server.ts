import express from 'express';
import { Server } from 'socket.io';
import http, { createServer } from 'http';
import next from 'next';

const port = 3288;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connect', (socket) => {
    const token = socket.handshake.query.token;
    io.emit('userCount', io.engine.clientsCount);
    io.emit('system', {
      content: `${token}님이 입장 하셨습니다.`,
    });

    socket.on('disconnect', () => {
      io.emit('userCount', io.engine.clientsCount);
      io.emit('system', {
        content: `${token}님이 퇴장 하셨습니다.`,
      });
    });

    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });

    socket.on('mouseMove', (data) => {
      socket.broadcast.emit('mouseMove', data);
      console.log(data);
    });

    app.all('*', (req, res) => {
      return nextHandler(req, res);
    });

    server.listen(port, () => {
      console.log(`port : ${port}`);
    });
  });
});
