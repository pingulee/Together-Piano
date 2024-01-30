import React from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

export default function PianoKey({ className, note }: PianoKeyProps) {
  // 마우스를 누를 때마다 새로운 Audio 객체를 생성하고 재생
  const handleMouseDown = () => {
    const audio = new Audio(`/sounds/${note}.mp3`);
    audio.play().catch((error) => console.error('음악 재생 중 오류 발생:', error));
  };

  // 마우스를 뗄 때 특별한 처리가 필요 없음
  // 각각의 Audio 객체는 독립적으로 재생되며, 사용자가 마우스를 떼면 재생이 자연스럽게 끝남

  return (
    <div
      className={className}
      onMouseDown={handleMouseDown}
    />
  );
}
