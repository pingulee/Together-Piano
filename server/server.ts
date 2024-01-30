import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import next from 'next';

const hostname = 'localhost';
const port = 3288;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  const io = new Server(createServer(server), {
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
  });

  server.all('*', (req: Request, res: Response) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err?: any) => {
    console.log(`http://${hostname}:${port}`);
  });
});
