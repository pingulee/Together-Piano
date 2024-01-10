import React from 'react';
import PianoKey from '@/app/components/Piano/PianoKeyComponent';
import { PianoNoteProp } from '@/app/interfaces/Piano/PianoNoteProp';
import { PianoSoundProp } from '@/app/interfaces/Piano/PianoSoundProp';

interface PianoKeyProps extends PianoNoteProp, PianoSoundProp {}

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
