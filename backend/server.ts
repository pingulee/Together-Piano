import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);
const port = 8080;

interface MousePosition {
  x: number;
  y: number;
}

let remoteMouses: { [socketId: string]: MousePosition } = {};

io.on('connection', (socket) => {
  console.log('사용자가 연결되었습니다.');

  socket.on('chat message', (msg: string) => {
    io.emit('chat message', {
      message: msg,
      timestamp: new Date().toLocaleString(),
    });
  });

  socket.on('mousePosition', (data: MousePosition) => {
    remoteMouses[socket.id] = data;
    io.emit('remoteMousesPosition', remoteMouses);
  });

  socket.on('mouseClick', (data: MousePosition) => {
    io.emit('clickEffect', data);
  });

  socket.on('disconnect', () => {
    delete remoteMouses[socket.id];
    io.emit('userDisconnected', socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`localhost:${port}`);
});
