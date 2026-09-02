import PianoKey from '@/app/components/piano-key';
import { isBlackKey, notesInOctave } from '@/app/lib/notes';
import type { NoteName } from '@/shared/socket-events';

interface PianoOctaveProps {
  octave: number;
  onPlay: (note: NoteName) => void;
}

export default function PianoOctave({ octave, onPlay }: PianoOctaveProps) {
  return (
    <>
      {notesInOctave(octave).map((note) => (
        <PianoKey
          key={note}
          note={`${note}${octave}`}
          isBlack={isBlackKey(note)}
          onPlay={onPlay}
        />
      ))}
    </>
  );
}
