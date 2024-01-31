import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { initSocketServer } from './socket/socket';

const hostname = 'localhost';
const port = Number(process.env.PORT || 3000);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const httpServer = createServer(app);

  initSocketServer(httpServer);

  app.all('*', (req: Request, res: Response) => {
    return nextHandler(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`http://${hostname}:${port}`);
  });
});
