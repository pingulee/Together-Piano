import type { NoteName } from '@/shared/socket-events';

/**
 * 한 옥타브의 12음. `public/sounds/` 의 파일명과 같은 소문자 표기를 씁니다.
 * `s` 는 샵(#)이며, 이름이 두 글자면 검은건반입니다.
 */
export const OCTAVE_NOTES = [
  'c',
  'cs',
  'd',
  'ds',
  'e',
  'f',
  'fs',
  'g',
  'gs',
  'a',
  'as',
  'b',
] as const;

/** 88건반의 양 끝 (A0 ~ C8) */
export const LOWEST_MIDI_NOTE = 21;
export const HIGHEST_MIDI_NOTE = 108;

/**
 * MIDI 노트 번호를 음원 파일명으로 변환합니다. (21 -> `a0`, 60 -> `c4`, 108 -> `c8`)
 * 88건반 범위를 벗어나면 대응하는 음원이 없으므로 null 을 돌려줍니다.
 */
export function midiNoteToName(midiNote: number): NoteName | null {
  if (midiNote < LOWEST_MIDI_NOTE || midiNote > HIGHEST_MIDI_NOTE) return null;

  const note = OCTAVE_NOTES[midiNote % OCTAVE_NOTES.length];
  const octave = Math.floor(midiNote / OCTAVE_NOTES.length) - 1;

  return `${note}${octave}`;
}

export interface PianoKey {
  note: NoteName;
  midi: number;
  isBlack: boolean;
  octave: number;
  /**
   * 왼쪽에서 몇 번째 흰건반인지.
   * 검은건반은 자기 바로 왼쪽에 있는 흰건반의 인덱스를 가집니다.
   */
  whiteIndex: number;
}

function buildKeys(): PianoKey[] {
  const keys: PianoKey[] = [];
  let whiteCount = 0;

  for (let midi = LOWEST_MIDI_NOTE; midi <= HIGHEST_MIDI_NOTE; midi += 1) {
    const pitch = OCTAVE_NOTES[midi % OCTAVE_NOTES.length];
    const isBlack = pitch.length > 1;
    const octave = Math.floor(midi / OCTAVE_NOTES.length) - 1;

    keys.push({
      note: `${pitch}${octave}`,
      midi,
      isBlack,
      octave,
      // 검은건반은 흰건반 카운터를 올리지 않으므로 직전 흰건반을 가리킵니다.
      whiteIndex: isBlack ? whiteCount - 1 : whiteCount,
    });

    if (!isBlack) whiteCount += 1;
  }

  return keys;
}

export const PIANO_KEYS: readonly PianoKey[] = buildKeys();

export const WHITE_KEYS = PIANO_KEYS.filter((key) => !key.isBlack);
export const BLACK_KEYS = PIANO_KEYS.filter((key) => key.isBlack);

/** 프리로드 대상 전체 음 이름 */
export const ALL_NOTES: readonly NoteName[] = PIANO_KEYS.map((key) => key.note);

/**
 * 건반 배치는 흰건반이 가로를 균등 분할하고, 검은건반이 그 경계 위에 얹히는
 * 구조입니다. 흰건반을 flex 로 늘어놓고 검은건반만 절대 위치로 올립니다.
 */
export const WHITE_KEY_WIDTH_PCT = 100 / WHITE_KEYS.length;

/** 실제 피아노의 검은건반은 흰건반보다 좁습니다. */
const BLACK_KEY_WIDTH_RATIO = 0.62;

export const BLACK_KEY_WIDTH_PCT = WHITE_KEY_WIDTH_PCT * BLACK_KEY_WIDTH_RATIO;

/** 검은건반의 왼쪽 위치(%). 왼쪽 흰건반과의 경계에 중심을 맞춥니다. */
export function blackKeyLeftPct(whiteIndex: number): number {
  const boundary = (whiteIndex + 1) * WHITE_KEY_WIDTH_PCT;
  return boundary - BLACK_KEY_WIDTH_PCT / 2;
}

/** `c` 로 시작하는 흰건반. 옥타브 눈금(C4 등) 표시에 씁니다. */
export function isOctaveMarker(key: PianoKey): boolean {
  return !key.isBlack && key.note.startsWith('c');
}

/** 화면에 보여 줄 음 이름 (`cs4` -> `C♯4`) */
export function formatNoteLabel(note: NoteName): string {
  const pitch = note.slice(0, -1);
  const octave = note.slice(-1);
  const letter = pitch[0].toUpperCase();
  return pitch.length > 1 ? `${letter}♯${octave}` : `${letter}${octave}`;
}

/** 음 이름 -> MIDI 번호 */
export const MIDI_BY_NOTE: ReadonlyMap<NoteName, number> = new Map(
  PIANO_KEYS.map((key) => [key.note, key.midi]),
);

/**
 * 샘플을 뜨는 간격(반음).
 *
 * 88건반을 모두 내려받으면 10MB 에 이르고 첫 소리도 늦어집니다. 실제 피아노
 * 샘플러들이 쓰는 방식대로 단3도(3반음) 간격으로만 샘플을 두고, 사이 음은
 * 재생 속도로 최대 ±1반음 피치를 옮겨 만듭니다. 이 정도 시프트는 피아노
 * 음색에서 구분되지 않으면서 데이터는 1/3 로 줄어듭니다.
 */
const SAMPLE_INTERVAL_SEMITONES = 3;

function buildAnchors(): NoteName[] {
  const anchors: NoteName[] = [];
  for (
    let midi = LOWEST_MIDI_NOTE;
    midi <= HIGHEST_MIDI_NOTE;
    midi += SAMPLE_INTERVAL_SEMITONES
  ) {
    const note = midiNoteToName(midi);
    if (note) anchors.push(note);
  }

  // 가장 높은 음이 간격에 안 걸리면 따로 넣어 위쪽이 과하게 늘어나지 않게 합니다.
  const highest = midiNoteToName(HIGHEST_MIDI_NOTE);
  if (highest && !anchors.includes(highest)) anchors.push(highest);

  return anchors;
}

/** 실제로 내려받는 샘플 목록 */
export const SAMPLE_NOTES: readonly NoteName[] = buildAnchors();

const SAMPLE_MIDIS: readonly number[] = SAMPLE_NOTES.map(
  (note) => MIDI_BY_NOTE.get(note) ?? LOWEST_MIDI_NOTE,
);

export interface SampleChoice {
  /** 내려받아 재생할 샘플 */
  sample: NoteName;
  /** 샘플을 목표 음으로 옮기기 위한 재생 속도 배수 */
  playbackRate: number;
}

/**
 * 목표 음에 가장 가까운 샘플과 필요한 재생 속도를 구합니다.
 * 반음 하나당 주파수는 2^(1/12) 배이므로 그 비율을 그대로 씁니다.
 */
export function chooseSample(note: NoteName): SampleChoice | null {
  const targetMidi = MIDI_BY_NOTE.get(note);
  if (targetMidi === undefined) return null;

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < SAMPLE_MIDIS.length; i += 1) {
    const distance = Math.abs(SAMPLE_MIDIS[i] - targetMidi);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  const semitones = targetMidi - SAMPLE_MIDIS[bestIndex];
  return {
    sample: SAMPLE_NOTES[bestIndex],
    playbackRate: 2 ** (semitones / 12),
  };
}

export interface KeyGeometry {
  /** 건반판 왼쪽에서의 위치(%) */
  left: number;
  /** 건반 너비(%) */
  width: number;
}

/**
 * 음 이름 -> 건반판 위 위치.
 *
 * 건반과 리본·오버레이가 같은 좌표를 써야 위아래가 어긋나지 않으므로
 * 계산을 한곳에 모아 둡니다.
 */
export const KEY_GEOMETRY: ReadonlyMap<NoteName, KeyGeometry> = new Map(
  PIANO_KEYS.map((key) => [
    key.note,
    key.isBlack
      ? { left: blackKeyLeftPct(key.whiteIndex), width: BLACK_KEY_WIDTH_PCT }
      : {
          left: key.whiteIndex * WHITE_KEY_WIDTH_PCT,
          width: WHITE_KEY_WIDTH_PCT,
        },
  ]),
);
