import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { db } from './client';

/** 마이그레이션 SQL 위치. Docker 이미지에도 함께 복사됩니다. */
const MIGRATIONS_FOLDER = process.env.MIGRATIONS_FOLDER ?? './drizzle';

/**
 * 스키마를 최신 상태로 맞춥니다.
 *
 * 이미 적용된 마이그레이션은 건너뛰므로 부팅마다 호출해도 안전합니다.
 * 서버 진입점에서 요청을 받기 전에 한 번 실행합니다.
 */
export function runMigrations(): void {
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
}
