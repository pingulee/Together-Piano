import http from 'http';
import { Server } from 'socket.io';

const socket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connect', (socket) => {
    console.log('사용자 연결', socket.id);
    io.emit('userCount', io.engine.clientsCount);

    socket.on('disconnect', () => {
      io.emit('userCount', io.engine.clientsCount);
    });

    socket.on('message', (data) => {
      console.log(data);
      io.emit('message', data);
    });
  });
};

export default socket;
