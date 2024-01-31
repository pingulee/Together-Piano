// socket.ts 파일

import { Server } from 'socket.io';

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // 사용자별 고유 연결을 추적하는 Set 객체
  const connectedUsers = new Set();

  io.on('connect', (socket) => {
    const token = socket.handshake.query.token;
    // 사용자 토큰을 Set에 추가
    connectedUsers.add(token);

    // Set의 크기를 사용하여 접속자 수를 업데이트
    io.emit('userCount', connectedUsers.size);

    io.emit('system', {
      content: `${token} has entered.`,
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(token);

      io.emit('userCount', connectedUsers.size);

      io.emit('system', {
        content: `${token} has left`,
      });
    });

    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });
  });
}
