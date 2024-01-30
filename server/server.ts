import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import next from 'next';

const hostname = 'localhost';
const port = Number(process.env.PORT || 8081);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  app.set('socketio', io);

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

  app.all('*', (req: Request, res: Response) => {
    return nextHandler(req, res);
  });

  httpServer.listen(port, (err?: any) => {
    console.log(`http://${hostname}:${port}`);
  });
});
