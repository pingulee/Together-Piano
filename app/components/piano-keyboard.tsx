'use client';

import { useCallback, useEffect } from 'react';

import PianoOctave from '@/app/components/piano-octave';
import { playNote, preloadNotes } from '@/app/lib/audio';
import { ALL_NOTES, midiNoteToName, OCTAVES } from '@/app/lib/notes';
import { socket } from '@/app/lib/socket';
import type { NoteName } from '@/shared/socket-events';

/** MIDI 상태 바이트의 상위 4비트가 `note on` 을 뜻하는 값 */
const MIDI_NOTE_ON = 0x90;
const MIDI_STATUS_MASK = 0xf0;
const MIDI_MESSAGE_LENGTH = 3;

export default function PianoKeyboard() {
  // 첫 타건이 밀리지 않도록 음원을 미리 디코드해 둡니다.
  useEffect(() => preloadNotes(ALL_NOTES), []);

  /** 내 연주는 즉시 재생하고 같은 방의 다른 사용자에게 전달합니다. */
  const playAndBroadcast = useCallback((note: NoteName) => {
    playNote(note);
    socket.emit('playNote', note);
  }, []);

  // 다른 사용자의 연주 수신
  useEffect(() => {
    socket.on('playNote', playNote);

    return () => {
      socket.off('playNote', playNote);
    };
  }, []);

  // MIDI 입력 장치 연결
  useEffect(() => {
    if (!navigator.requestMIDIAccess) return;

    let inputs: MIDIInputMap | null = null;

    const handleMidiMessage = (event: MIDIMessageEvent) => {
      const data = event.data;
      if (!data || data.length < MIDI_MESSAGE_LENGTH) return;

      const [status, midiNote, velocity] = data;

      // 상태 바이트를 마스킹해 16개 채널 모두를 받고,
      // velocity 0 인 note on 은 note off 와 같으므로 걸러냅니다.
      if ((status & MIDI_STATUS_MASK) !== MIDI_NOTE_ON || velocity === 0)
        return;

      const note = midiNoteToName(midiNote);
      if (note) playAndBroadcast(note);
    };

    navigator.requestMIDIAccess().then(
      (access) => {
        inputs = access.inputs;
        for (const input of inputs.values()) {
          input.onmidimessage = handleMidiMessage;
        }
      },
      () => {
        // MIDI 장치가 없거나 권한이 거부된 경우입니다. 마우스 연주는 그대로 됩니다.
      },
    );

    return () => {
      if (!inputs) return;
      for (const input of inputs.values()) {
        input.onmidimessage = null;
      }
    };
  }, [playAndBroadcast]);

  return (
    <div className='piano-cursor flex h-1/5 w-full'>
      {OCTAVES.map((octave) => (
        <PianoOctave key={octave} octave={octave} onPlay={playAndBroadcast} />
      ))}
    </div>
  );
}
