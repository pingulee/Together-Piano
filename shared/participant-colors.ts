/**
 * 참가자 색 팔레트.
 *
 * 어두운 배경 위에서 서로 구분되고 텍스트로도 읽히도록 고른 값들입니다.
 * 무작위 hue 를 쓰면 탁하거나 서로 비슷한 색이 나와 정돈되어 보이지 않으므로
 * 고정 팔레트에서 배정합니다.
 *
 * 서버(색 배정)와 클라이언트(대체 색)가 함께 쓰므로 런타임 값이 들어 있습니다.
 * 서버 빌드에도 함께 컴파일됩니다.
 */
export const PARTICIPANT_COLORS = [
  '#f2a93b',
  '#4fd1c5',
  '#a78bfa',
  '#4cb2f5',
  '#fb7185',
  '#a3e635',
  '#fb923c',
  '#f472b6',
  '#22d3ee',
  '#818cf8',
] as const;

/** 참가자를 찾지 못했을 때 쓰는 중립 색 */
export const FALLBACK_PARTICIPANT_COLOR = '#8a8a96';

/**
 * 소켓 id 로부터 색을 정합니다.
 *
 * 같은 id 면 항상 같은 색이 나오므로 서버가 재시작해도 표시가 흔들리지 않고,
 * 클라이언트가 색을 모를 때 같은 함수로 같은 값을 계산할 수 있습니다.
 */
export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % PARTICIPANT_COLORS.length;
  return PARTICIPANT_COLORS[index];
}
