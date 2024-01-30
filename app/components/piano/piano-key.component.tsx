import React, { useEffect, useRef } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

async function playNote(note: string, duration: string | null) {
  const audio = new Audio(`/sounds/${note}.mp3`);

  try {
    await audio.play();
  } catch (error) {
    console.error('음악 재생 중 오류 발생:', error);
  }
}

export default function PianoKey(props: PianoKeyProps) {
  const noteRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const play = () => playNote(props.note, '3n');

    const element = noteRef.current;
    if (element) {
      element.addEventListener('mousedown', play);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousedown', play);
      }
    };
  }, [props.note]);

  return (
    <div
      className={props.className}
      onMouseDown={() => playNote(props.note, '3n')}
    />
  );
}
