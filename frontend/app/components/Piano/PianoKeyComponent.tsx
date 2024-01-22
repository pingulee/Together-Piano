import React from 'react';
import { PianoNoteProp } from '@/app/types/Piano/PianoNoteProp';
import { PianoSoundProp } from '@/app/types/Piano/PianoSoundProp';

interface PianoKeyProps extends PianoNoteProp, PianoSoundProp {}

export default function PianoKeyComponent({
  pianoNote,
  pianoSound,
}: PianoKeyProps) {
  return <div onClick={pianoSound}>{pianoNote}</div>;
}
