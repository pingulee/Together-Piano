import type { Server as HttpServer } from 'node:http';
import type { Server as IoServer } from 'socket.io';

/** 종료 신호를 받은 뒤 연결이 끊기길 기다리는 최대 시간 */
const SHUTDOWN_TIMEOUT_MS = 10_000;

/**
 * 컨테이너 런타임(ECS/Docker)이나 오케스트레이터가 보내는 종료 신호를 받아
 * 연결을 정리하고 내려갑니다.
 *
 * 프로세스 재시작은 런타임이 담당하므로 별도의 프로세스 매니저를 두지 않습니다.
 */
export function registerShutdownHandlers(
  httpServer: HttpServer,
  io: IoServer,
): void {
  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} 수신, 종료합니다.`);

    // 연결이 정상적으로 닫히지 않아도 무한 대기하지 않도록 상한을 둡니다.
    const forceExit = setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS);
    forceExit.unref();

    await io.close();
    httpServer.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}
