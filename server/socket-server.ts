import { createServer } from 'node:http';
import express from 'express';

import { HOST, PORT } from './env';
import { registerHealthCheck } from './health';
import { registerShutdownHandlers } from './lifecycle';
import { createSocketServer } from './socket';

/**
 * 소켓 전용 서버.
 *
 * 프론트엔드를 Amplify 같은 정적/SSR 호스팅에 따로 올릴 때 씁니다.
 * 그 경우 Next 는 이 프로세스에서 서빙하지 않으므로, 브라우저는
 * `NEXT_PUBLIC_SOCKET_URL` 로 이 서버에 직접 접속합니다.
 *
 * 접속자 명단을 프로세스 메모리에 두기 때문에 인스턴스를 여러 개로 늘리려면
 * socket.io 어댑터(Redis 등)를 먼저 붙여야 합니다.
 */
async function main(): Promise<void> {
  const app = express();
  const httpServer = createServer(app);
  const io = createSocketServer(httpServer);

  registerHealthCheck(app);

  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, HOST, resolve);
  });
  console.log(`소켓 서버 시작: ${HOST}:${PORT}`);

  registerShutdownHandlers(httpServer, io);
}

main().catch((error: unknown) => {
  console.error('소켓 서버 시작 실패:', error);
  process.exit(1);
});
