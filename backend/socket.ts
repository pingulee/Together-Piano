import http from 'http';
import { Server } from 'socket.io';

const socket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
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
    });
  });
};

export default socket;
