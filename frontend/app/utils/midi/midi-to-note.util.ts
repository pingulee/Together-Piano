export default function midiNoteToNoteOctave(
  midiNote: number,
): [string, number] {
  // MIDI 노트 번호와 음계 이름 배열을 매핑합니다.
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];

  // MIDI 노트 번호를 음계 이름과 옥타브로 변환합니다.
  const noteIndex = midiNote % 12;
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = noteNames[noteIndex];

  return [noteName, octave];
}
