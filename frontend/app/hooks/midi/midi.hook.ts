import { useEffect, useState } from 'react';
import handleMidiInput from '@/app/utils/midi/midi-input.util';

export function useMidiInput() {
  const [midiMessages, setMidiMessages] = useState<Uint8Array[]>([]);

  useEffect(() => {
    // MIDI 입력 처리 함수를 호출하여 MIDI 메시지를 받습니다.
    handleMidiInput((midiData) => {
      // 받은 MIDI 메시지를 상태에 추가합니다.
      setMidiMessages((prevMessages) => [...prevMessages, midiData]);
    });
  }, []);

  return midiMessages;
}
