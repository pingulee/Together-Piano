import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { initSocketServer } from '@/server/socket/socket';
import postsRouter from '@/server/routes/post';
import { connectDatabase } from '@/server/database';
import Feedback from '@/server/models/feedback.model';

const hostname = 'localhost';
const port = Number(process.env.PORT || 3000);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

(async () => {
  try {
    await nextApp.prepare();

    const app = express();
    const httpServer = createServer(app);

    initSocketServer(httpServer);

    app.get('/api/feedback', async (req: Request, res: Response) => {
      try {
        const feedbacks = await Feedback.find();
        console.log(feedbacks);
        res.json(feedbacks);
      } catch (error) {
        res.status(500).json({
          message: '서버에서 데이터를 조회하는 중 오류가 발생했습니다.',
          error,
        });
      }
    });

    app.all('*', (req: Request, res: Response) => {
      return nextHandler(req, res);
    });

    httpServer.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.error('서버 시작 오류:', error);
  }
})();
