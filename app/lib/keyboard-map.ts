/**
 * 컴퓨터 키보드 매핑.
 *
 * 온라인 피아노에서 통용되는 2열 배치를 씁니다. 아래줄(z~m)이 기준 옥타브,
 * 윗줄(q~])이 그 위 옥타브를 담당하고, 숫자열이 검은건반에 들어갑니다.
 * MIDI 번호 대신 기준 C 로부터의 반음 오프셋으로 정의해 옥타브 이동이 쉽습니다.
 */

/** 키 -> 기준 C 로부터의 반음 오프셋 */
const KEY_OFFSETS: Readonly<Record<string, number>> = {
  // 아래줄: 기준 옥타브 C ~ B
  z: 0,
  s: 1,
  x: 2,
  d: 3,
  c: 4,
  v: 5,
  g: 6,
  b: 7,
  h: 8,
  n: 9,
  j: 10,
  m: 11,
  // 아래줄 끝에서 다음 옥타브로 조금 더
  ',': 12,
  l: 13,
  '.': 14,
  ';': 15,
  '/': 16,

  // 윗줄: 기준 옥타브 +1 의 C ~ B
  q: 12,
  2: 13,
  w: 14,
  3: 15,
  e: 16,
  r: 17,
  5: 18,
  t: 19,
  6: 20,
  y: 21,
  7: 22,
  u: 23,
  // 윗줄 끝에서 한 옥타브 더
  i: 24,
  9: 25,
  o: 26,
  0: 27,
  p: 28,
  '[': 29,
  '=': 30,
  ']': 31,
};

/** 기준 옥타브를 옮기는 키 */
export const OCTAVE_DOWN_KEYS = new Set(['arrowleft', '-']);
export const OCTAVE_UP_KEYS = new Set(['arrowright', '+']);

/** 서스테인 페달 */
export const SUSTAIN_KEYS = new Set([' ', 'shift']);

/** 기준 옥타브의 기본값과 허용 범위. C3 을 기본으로 둡니다. */
export const DEFAULT_BASE_OCTAVE = 3;
export const MIN_BASE_OCTAVE = 1;
export const MAX_BASE_OCTAVE = 5;

/**
 * 눌린 키를 MIDI 번호로 바꿉니다. 매핑에 없는 키는 null 입니다.
 *
 * `event.key` 는 한글 입력 상태나 Shift 조합에서 값이 달라지므로,
 * 물리 키 위치를 나타내는 `event.code` 에서 먼저 글자를 뽑아냅니다.
 */
export function keyToMidi(
  code: string,
  key: string,
  baseOctave: number,
): number | null {
  const token = normalizeKey(code, key);
  if (!token) return null;

  const offset = KEY_OFFSETS[token];
  if (offset === undefined) return null;

  // MIDI 12 = C0 이므로 (octave + 1) * 12 가 해당 옥타브의 C 입니다.
  return (baseOctave + 1) * 12 + offset;
}

function normalizeKey(code: string, key: string): string | null {
  // KeyZ -> z, Digit2 -> 2 처럼 물리 위치에서 바로 뽑아냅니다.
  if (code.startsWith('Key')) return code.slice(3).toLowerCase();
  if (code.startsWith('Digit')) return code.slice(5);

  const byCode: Readonly<Record<string, string>> = {
    Comma: ',',
    Period: '.',
    Semicolon: ';',
    Slash: '/',
    BracketLeft: '[',
    BracketRight: ']',
    Equal: '=',
    Minus: '-',
  };
  if (byCode[code]) return byCode[code];

  // code 를 못 쓰는 환경(일부 가상 키보드)에서는 key 로 대체합니다.
  const lower = key.toLowerCase();
  return lower.length === 1 ? lower : null;
}

/**
 * 기준 옥타브에 대응하는 `음 -> 키 글자` 표.
 * 건반 위에 어떤 키를 누르면 되는지 표시하는 데 씁니다.
 */
export function shortcutsForOctave(
  baseOctave: number,
  midiToName: (midi: number) => string | null,
): Map<string, string> {
  const shortcuts = new Map<string, string>();

  for (const [token, offset] of Object.entries(KEY_OFFSETS)) {
    const note = midiToName((baseOctave + 1) * 12 + offset);
    // 같은 음에 여러 키가 걸리면 먼저 정의된 쪽을 남깁니다.
    if (note && !shortcuts.has(note)) shortcuts.set(note, token);
  }

  return shortcuts;
}
