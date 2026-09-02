/** 서버 프로세스 설정. 기본값은 로컬 개발 기준이며, 운영에서 위험한 기본값은 거부합니다. */

const DEFAULT_PORT = 3000;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEV = !IS_PRODUCTION;

function readPort(): number {
  const raw = process.env.PORT;
  if (!raw) return DEFAULT_PORT;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    throw new Error(`PORT 값이 올바르지 않습니다: ${raw}`);
  }
  return parsed;
}

function readCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN?.trim();

  if (!raw) {
    // 운영에서 모든 오리진을 허용한 채로 뜨는 일을 막습니다.
    if (IS_PRODUCTION) {
      throw new Error(
        'CORS_ORIGIN 을 설정해야 합니다. 소켓에 접속할 프론트엔드 오리진을 지정하세요.',
      );
    }
    return ['*'];
  }

  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const PORT = readPort();

/** 컨테이너/EC2 에서 외부 접속을 받으려면 0.0.0.0 이어야 합니다. */
export const HOST = process.env.HOST ?? '0.0.0.0';

/** Next 에 알려 줄 공개 호스트명 */
export const HOSTNAME = process.env.HOSTNAME ?? 'localhost';

export const CORS_ORIGINS = readCorsOrigins();
