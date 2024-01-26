import React from 'react';
import { PianoNote } from '@/app/interfaces/piano/piano-note.interface';
import { PianoSound } from '@/app/interfaces/piano/piano-sound.interface';

interface PianoKeyProps extends PianoNote, PianoSound {}

export default function PianoKey({ pianoNote, pianoSound }: PianoKeyProps) {
  return <div onClick={pianoSound}>{pianoNote}</div>;
}
