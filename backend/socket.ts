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

    socket.on('disconnect', () => console.log('사용자 연결 끊김', socket.id));

    socket.on('message', (data: any) => {
      console.log(data); // 클라이언트 -> 서버
    });
  });
};

export default socket;
