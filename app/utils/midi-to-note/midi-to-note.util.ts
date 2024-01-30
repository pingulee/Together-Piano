export const onMIDISuccess = (midiAccess: WebMidi.MIDIAccess) => {
  const inputs = midiAccess.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMIDIMessage;
  }
}

export const onMIDIFailure = () => {
  console.error('MIDI 디바이스에 접근할 수 없습니다.');
};

export const onMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
  const [command, note, velocity] = message.data;

  // MIDI 'note on' 메시지 처리 (velocity > 0)
  if (command === 144 && velocity > 0) {
    playNoteFromMIDI(note);
  }

  // MIDI 'note off' 메시지 처리
  if (command === 128 || (command === 144 && velocity === 0)) {
    stopNoteFromMIDI(note);
  }
};

export const stopNoteFromMIDI = (note: number) => {
  // MIDI 노트 번호를 바탕으로 해당하는 음을 중지
  // 이 기능의 구현은 오디오 재생을 어떻게 관리하는지에 따라 달라집니다.
};

export const calculateNoteName = (note: number): string => {
  const notes = [
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
  ];
  const octave = Math.floor((note - 12) / 12); // MIDI 노트 번호로부터 옥타브 계산
  const noteIndex = (note - 12) % 12; // 옥타브를 제외한 나머지 값으로 음계 인덱스 계산
  const noteName = notes[noteIndex]; // 음계 배열에서 해당 인덱스의 음 이름 찾기

  return `${noteName}${octave}`; // 최종 음 이름 반환 (예: 'cs4')
}

export function playNoteFromMIDI(note: number) {
  // MIDI 노트 번호를 바탕으로 피아노 키의 음과 옥타브를 계산
  // 이 부분은 MIDI 설정과 피아노 키 매핑에 따라 달라질 수 있습니다.
  const noteName = calculateNoteName(note);
  const audio = new Audio(`/sounds/${noteName}.mp3`);
  audio
    .play()
    .catch((error) => console.error('음악 재생 중 오류 발생:', error));
}
