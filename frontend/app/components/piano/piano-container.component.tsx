'use client';
import React, { useEffect, useState } from 'react';

import Octave from './octave';

export default function PianoContainer() {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // 창 너비 업데이트 함수
    const updateWindowDimensions = () => {
      setWindowWidth(window.innerWidth);
    };

    // 컴포넌트 마운트 시 창 너비 설정
    updateWindowDimensions();

    // 창 크기 변경 시 너비 업데이트
    window.addEventListener('resize', updateWindowDimensions);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', updateWindowDimensions);
  }, []);

  useEffect(() => {
    async function setupMidiInput() {
      if (!navigator.requestMIDIAccess) {
        console.log('이 브라우저는 Web MIDI API를 지원하지 않습니다.');
        return;
      }

      try {
        const midiAccess = await navigator.requestMIDIAccess();
        const inputs = midiAccess.inputs.values();
        for (
          let input = inputs.next();
          input && !input.done;
          input = inputs.next()
        ) {
          input.value.onmidimessage = handleMidiMessage;
        }
      } catch (err) {
        console.error('MIDI 접근에 실패했습니다.', err);
      }
    }

    function handleMidiMessage(midiMessage: WebMidi.MIDIMessageEvent) {
      const data = midiMessage.data;
      const command = data[0];
      const note = data[1];
      // Note on 메시지인 경우, 해당하는 MP3 재생
      if (command === 144) {
        playMp3ForNote(note);
      }
    }

    function playMp3ForNote(note: number) {
      const fileName = `pianoNote${note}.mp3`;
      const audio = new Audio(`/sounds/${fileName}`);
      audio
        .play()
        .catch((err) => console.error('MP3 재생 중 오류가 발생했습니다.', err));
    }

    setupMidiInput();
  }, []);

  const pitchNum = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div className='flex justify-center overflow-auto w-full piano-cursor'>
      {pitchNum.map((n) => (
        <Octave key={n} pitch={n} windowWidth={windowWidth} />
      ))}
    </div>
  );
}
