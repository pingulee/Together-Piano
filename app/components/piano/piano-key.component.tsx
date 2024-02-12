import React, { useEffect, useRef, useState } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

const PianoKey: React.FC<PianoKeyProps> = ({ className, note }) => {
  const playSound = () => {
    const audio = new Audio(`/sounds/${note}.mp3`); // 오디오 파일 경로 설정
    audio.play(); // 오디오 재생
  };

  return (
    <div
      className={className}
      onMouseDown={playSound} // 마우스 버튼을 누르면 오디오 재생
    />
  );
};

export default PianoKey;
