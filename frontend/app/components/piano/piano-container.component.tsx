'use client';
import React, { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import PianoOctave from './piano-octave.component';

export default function PianoContainer() {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null); // 요소에 대한 참조 생성

  useEffect(() => {
    function updateWidth() {
      // containerRef.current가 존재하면 너비를 업데이트
      if (containerRef.current) {
        setWindowWidth(containerRef.current.offsetWidth);
      }
    }

    window.addEventListener('resize', updateWidth); // 화면 크기 변경 시 너비 업데이트
    updateWidth(); // 컴포넌트 마운트 시 초기 너비 설정

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 마운트 시에만 실행

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
    <div
      ref={containerRef} // 참조를 div 요소에 연결
      className='piano flex justify-center overflow-auto w-full piano-cursor'
    >
      {pitchNum.map((n) => (
        <PianoOctave key={n} pitch={n} windowWidth={windowWidth} />
      ))}
    </div>
  );
}
