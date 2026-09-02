import type { Express } from 'express';

/** 로드밸런서·컨테이너 헬스체크용 엔드포인트 */
export function registerHealthCheck(app: Express): void {
  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
  });
}
