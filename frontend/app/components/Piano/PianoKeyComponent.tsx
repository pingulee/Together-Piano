import React from 'react';
import { PianoNoteProp } from '@/app/interfaces/Piano/PianoNoteProp';
import { PianoSoundProp } from '@/app/interfaces/Piano/PianoSoundProp';

interface PianoKeyProps extends PianoNoteProp, PianoSoundProp {}

export default function PianoKeyComponent({
  pianoNote,
  pianoSound,
}: PianoKeyProps) {
  return <div onClick={pianoSound}>{pianoNote}</div>;
}
