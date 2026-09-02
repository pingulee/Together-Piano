import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema';

/**
 * SQLite 파일 경로. 컨테이너에서는 볼륨으로 마운트한 디렉터리를 가리켜야
 * 재배포 후에도 로그인 정보가 남습니다.
 */
export const DATABASE_PATH = process.env.DATABASE_PATH ?? './data/app.db';

/**
 * 프로세스당 연결 하나를 재사용합니다.
 *
 * Next 개발 서버는 코드가 바뀔 때 모듈을 다시 평가하므로, 전역에 담아 두지 않으면
 * 연결이 계속 쌓입니다. better-sqlite3 는 동기 API 라 커넥션 풀이 필요 없습니다.
 */
const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
};

function createConnection(): Database.Database {
  mkdirSync(dirname(DATABASE_PATH), { recursive: true });

  const connection = new Database(DATABASE_PATH);

  // WAL 은 읽기와 쓰기가 서로를 막지 않게 해 동시 접속에서 잠금 대기를 줄입니다.
  connection.pragma('journal_mode = WAL');
  // 외래키 제약(세션/계정의 cascade 삭제)은 SQLite 에서 기본으로 꺼져 있습니다.
  connection.pragma('foreign_keys = ON');

  return connection;
}

export const sqlite = (globalForDb.sqlite ??= createConnection());

export const db = drizzle(sqlite, { schema });
