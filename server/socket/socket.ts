import { Server } from 'socket.io';

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });


  io.on('connect', (socket) => {
    const name = socket.handshake.query.name;

    if (name) {
      io.emit('system', {
        content: `${name} has join`,
      });
    }

    socket.on('disconnect', () => {

      if (name) {
        io.emit('system', {
          content: `${name} has left`,
        });
      }
    });

    socket.on('playNote', (data) => {
      socket.broadcast.emit('playNote', data);
    });

    socket.on('message', (data) => {
      socket.broadcast.emit('message', data);
    });
  });
}
