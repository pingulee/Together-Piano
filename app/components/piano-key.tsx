import type { NoteName } from '@/shared/socket-events';

interface PianoKeyProps {
  note: NoteName;
  isBlack: boolean;
  onPlay: (note: NoteName) => void;
}

export default function PianoKey({ note, isBlack, onPlay }: PianoKeyProps) {
  return (
    <button
      type='button'
      aria-label={note}
      className={`piano ${isBlack ? 'black-key' : 'white-key'} hover:bg-sub-highlight active:bg-highlight`}
      onMouseDown={() => onPlay(note)}
    />
  );
}
