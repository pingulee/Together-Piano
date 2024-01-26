import React from 'react';
import PianoKey from '@/app/components/piano/piano-key.component';
import { PianoNote } from '@/app/interfaces/piano/piano-note.interface';
import { PianoSound } from '@/app/interfaces/piano/piano-sound.interface';

interface PianoKeyProps extends PianoNote, PianoSound {}

export default function PianoComponent() {
  const pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const pianoSounds = (note: string) => {
    // 소리 재생 로직
  };

  return (
    <div>
      {pianoNotes.map((note) => (
        <PianoKey
          key={note}
          pianoNote={note}
          pianoSound={() => pianoSounds(note)}
        />
      ))}
    </div>
  );
}
