/**
 * 브라우저에 노출되는 환경변수.
 *
 * `NEXT_PUBLIC_` 접두사가 붙은 값은 빌드 시점에 정적으로 치환되므로
 * `process.env.NEXT_PUBLIC_...` 를 직접 구조 분해하면 안 됩니다.
 */

/**
 * 소켓 서버 주소.
 *
 * 비워 두면 페이지와 같은 오리진에 접속합니다. Next 와 소켓 서버를 한 프로세스에서
 * 함께 띄우는 배포(단일 서버)에서는 비워 두는 것이 맞고, 프론트엔드를 따로
 * 호스팅하는 경우(예: Amplify)에는 소켓 서버의 공개 주소를 지정해야 합니다.
 */
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? '';

/** 국가 코드 조회 API. 국기 표시에만 쓰이며 실패해도 앱은 정상 동작합니다. */
export const GEOLOCATION_API_URL =
  process.env.NEXT_PUBLIC_GEOLOCATION_API_URL ??
  'https://geolocation-db.com/json/';
