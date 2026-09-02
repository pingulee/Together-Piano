import { createServer } from 'node:http';
import express from 'express';
import next from 'next';

import { runMigrations } from '../shared/db/migrate';
import { HOST, HOSTNAME, IS_DEV, PORT } from './env';
import { registerHealthCheck } from './health';
import { registerShutdownHandlers } from './lifecycle';
import { createSocketServer } from './socket';

/**
 * Next 와 socket.io 를 한 프로세스에서 함께 서비스하는 단일 서버 진입점.
 *
 * 로컬 개발과, 프론트·소켓을 같은 호스트에서 돌리는 배포에 씁니다.
 * 프론트엔드를 따로 호스팅한다면 `socket-server.ts` 를 대신 실행하세요.
 */
async function main(): Promise<void> {
  // 요청을 받기 전에 스키마를 최신 상태로 맞춥니다.
  runMigrations();

  const nextApp = next({ dev: IS_DEV, hostname: HOSTNAME, port: PORT });
  await nextApp.prepare();

  const handleNextRequest = nextApp.getRequestHandler();
  const app = express();
  const httpServer = createServer(app);
  const io = createSocketServer(httpServer);

  // Next 렌더를 거치지 않도록 헬스체크를 폴백보다 앞에 둡니다.
  registerHealthCheck(app);

  // Express 5 에서는 와일드카드 경로 대신 미들웨어로 폴백을 받습니다.
  app.use((req, res) => handleNextRequest(req, res));

  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, HOST, resolve);
  });
  console.log(`서버 시작: http://${HOSTNAME}:${PORT}`);

  registerShutdownHandlers(httpServer, io);
}

main().catch((error: unknown) => {
  console.error('서버 시작 실패:', error);
  process.exit(1);
});
