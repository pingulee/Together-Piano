'use client';
import React, { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import PianoOctave from './piano-octave.component';

export default function PianoContainer() {

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
    <div className='flex flex-col w-full justify-center'>
      <div
        className='flex w-full h-1/5 piano-cursor '
      >
        {pitchNum.map((n) => (
          <PianoOctave key={n} pitch={n} />
        ))}
      </div>
    </div>
  );
}
