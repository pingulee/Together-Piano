import React, { useEffect, useRef, useState } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
  playNote: (note: string) => void; // 소리 재생 함수 prop 추가
}

export default function PianoKey({ className, note, playNote }: PianoKeyProps) {
  return (
    <div
      className={className}
      onMouseDown={() => playNote(note)} // 마우스 클릭 시 playNote 함수 호출
    />
  );
}
