import React from 'react';
import PianoKey from './piano-key.component';

interface OctaveProps {
  pitch: number;
}

export default function PianoOctave({ pitch }: OctaveProps) {
  const notes = [
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

  const createKey = (n: string) => (
    <PianoKey
      key={n + pitch}
      note={n + pitch}
      className={`active:bg-highlight hover:bg-subHighlight piano ${
        n.length === 1 ? 'white-key' : 'black-key'
      }`}
    />
  );

  const createOctave = (pitch: number) => {
    if (pitch === 0) return notes.slice(-3).map((n) => createKey(n));
    if (pitch === 8) return notes.slice(0, 1).map((n) => createKey(n));
    return notes.map((n) => createKey(n));
  };

  return <>{createOctave(pitch)}</>;
}
