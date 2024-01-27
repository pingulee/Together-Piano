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
      // 메시지를 보낸 클라이언트를 제외한 나머지 클라이언트에게만 메시지를 브로드캐스트
      socket.broadcast.emit('message', data);
    });
  });
};

export default socket;
