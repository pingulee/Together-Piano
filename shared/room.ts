/**
 * 방 식별자 규칙.
 *
 * 방 이름이 곧 식별자이자 URL 경로입니다(`/piano/재즈방`). 따로 id 를 두면
 * 링크를 공유받은 사람이 어느 방인지 알 수 없고, 서버가 재시작하면 링크가
 * 죽습니다. 이름을 그대로 쓰면 같은 이름으로 다시 들어가면 같은 방입니다.
 *
 * 클라이언트(입력 검증)와 서버(신뢰 경계)가 같은 함수를 씁니다.
 */

/** 방 이름 최대 길이. 상단 바와 로비 목록이 깨지지 않는 선입니다. */
export const MAX_ROOM_ID_LENGTH = 24;

/** 한 방의 최대 인원. 모든 타건이 전원에게 중계되므로 상한이 필요합니다. */
export const ROOM_CAPACITY = 16;

/** 링크 없이 들어왔을 때 안내할 기본 방 */
export const DEFAULT_ROOM_ID = '연습실';

/** 제어 문자는 화면과 로그를 망가뜨리므로 지웁니다. */
const CONTROL_CHARS = /\p{C}/gu;

/** URL 경로 한 칸에 들어가야 하므로 슬래시는 허용하지 않습니다. */
const PATH_SEPARATORS = /[/\\]/g;

/**
 * 입력을 방 식별자로 정규화합니다.
 *
 * @returns 쓸 수 있는 식별자, 또는 방 이름으로 볼 수 없으면 `null`
 */
export function normalizeRoomId(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const cleaned = input
    .replace(CONTROL_CHARS, '')
    .replace(PATH_SEPARATORS, ' ')
    // 연속 공백을 하나로 모아 '재즈  방' 과 '재즈 방' 이 다른 방이 되지 않게 합니다.
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  return cleaned.slice(0, MAX_ROOM_ID_LENGTH);
}

/** 방 주소. 한글·공백이 들어갈 수 있으므로 반드시 인코딩합니다. */
export function roomPath(roomId: string): string {
  return `/piano/${encodeURIComponent(roomId)}`;
}
