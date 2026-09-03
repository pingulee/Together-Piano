/**
 * 참가자 색 팔레트.
 *
 * 어두운 배경 위에서 서로 구분되고 텍스트로도 읽히도록 고른 값들입니다.
 * 무작위 hue 를 쓰면 탁하거나 서로 비슷한 색이 나와 정돈되어 보이지 않으므로
 * 고정 팔레트에서 고릅니다.
 *
 * 팔레트가 고정이라는 점은 보안에도 필요합니다. 참가자 색은 커서·이름표·건반의
 * 인라인 `style` 로 들어가므로, 임의 문자열을 그대로 받으면 다른 참가자 화면에
 * 원하는 CSS 를 심을 수 있습니다. 서버는 `isParticipantColor` 로 이 목록에
 * 있는 값만 통과시킵니다.
 *
 * 서버(검증·배정)와 클라이언트(선택 UI)가 함께 쓰므로 런타임 값이 들어 있습니다.
 */
export const PARTICIPANT_COLORS = [
  '#f2a93b',
  '#facc15',
  '#a3e635',
  '#34d399',
  '#4fd1c5',
  '#22d3ee',
  '#4cb2f5',
  '#818cf8',
  '#a78bfa',
  '#f472b6',
  '#fb7185',
  '#fb923c',
] as const;

/** 참가자를 찾지 못했을 때 쓰는 중립 색 */
export const FALLBACK_PARTICIPANT_COLOR = '#8a8a96';

const ALLOWED_COLORS: ReadonlySet<string> = new Set(PARTICIPANT_COLORS);

/** 팔레트에 있는 색인지 확인합니다. 서버가 신뢰 경계에서 씁니다. */
export function isParticipantColor(value: unknown): value is string {
  return typeof value === 'string' && ALLOWED_COLORS.has(value);
}

/**
 * 소켓 id 로부터 색을 정합니다.
 *
 * 참가자가 색을 고르지 않았을 때의 기본값입니다. 같은 id 면 항상 같은 색이
 * 나오므로 표시가 흔들리지 않습니다.
 */
export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % PARTICIPANT_COLORS.length;
  return PARTICIPANT_COLORS[index];
}
