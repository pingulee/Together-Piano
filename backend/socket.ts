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

    // 새 사용자가 연결될 때마다 모든 클라이언트에게 현재 사용자 수를 브로드캐스트
    io.emit('userCount', io.engine.clientsCount);

    socket.on('disconnect', () => {
      // 사용자가 연결을 끊을 때마다 모든 클라이언트에게 현재 사용자 수를 브로드캐스트
      io.emit('userCount', io.engine.clientsCount);
    });

    socket.on('message', (data) => {
      console.log(data);
      io.emit('message', data);
    });
  });
};

export default socket;
