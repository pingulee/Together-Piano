import { Server, Socket } from 'socket.io';

export function initSocketServer(httpServer: any): void {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const connectedUsers = new Map<string, string>(); // Socket ID와 사용자 이름을 저장

  io.on('connection', (socket: Socket) => {
    const name = socket.handshake.query.name as string;

    if (name) {
      connectedUsers.set(socket.id, name);
      io.emit('system', { content: `${name} has joined` });
      io.emit('userList', Array.from(connectedUsers.values())); // 접속자 명단 전송
      io.emit('userCount', connectedUsers.size); // 접속자 수 전송
    }
  
    socket.on('disconnect', () => {
      if (name) {
        connectedUsers.delete(socket.id);
        io.emit('system', { content: `${name} has left` });
        io.emit('userList', Array.from(connectedUsers.values())); // 접속자 명단 업데이트
        io.emit('userCount', connectedUsers.size); // 접속자 수 업데이트
      }
    });
  
    // 접속자 명단 요청 처리
    socket.on('requestUserList', () => {
      socket.emit('userList', Array.from(connectedUsers.values())); // 요청한 클라이언트에게만 명단 전송
    });
  

    socket.on('playNote', (data) => {
      socket.broadcast.emit('playNote', data);
    });

    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });
  });
}
