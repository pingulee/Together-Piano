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

export type OctaveNote = (typeof OCTAVE_NOTES)[number];

/** 88건반 피아노가 걸쳐 있는 옥타브 */
export const OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

/** 88건반의 양 끝 (A0 ~ C8) */
const LOWEST_MIDI_NOTE = 21;
const HIGHEST_MIDI_NOTE = 108;

/** 옥타브 0 은 a0·as0·b0 만, 옥타브 8 은 c8 만 존재합니다. */
export function notesInOctave(octave: number): readonly OctaveNote[] {
  if (octave === 0) return OCTAVE_NOTES.slice(-3);
  if (octave === 8) return OCTAVE_NOTES.slice(0, 1);
  return OCTAVE_NOTES;
}

export function isBlackKey(note: OctaveNote): boolean {
  return note.length > 1;
}

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

/** 88건반 전체 음 이름. 프리로드 대상 목록으로 사용합니다. */
export const ALL_NOTES: readonly NoteName[] = OCTAVES.flatMap((octave) =>
  notesInOctave(octave).map((note) => `${note}${octave}`),
);
