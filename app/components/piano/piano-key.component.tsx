import React from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

export default function PianoKey(props: PianoKeyProps) {
  return <div className={props.className} />;
}