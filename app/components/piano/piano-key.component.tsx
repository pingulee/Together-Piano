import React, { useRef } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

export default function PianoKey({ className, note }: PianoKeyProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null); // 현재 재생 중인 Audio 객체를 저장할 ref

  const handleMouseDown = () => {
    // 새 Audio 객체 생성 및 재생
    const audio = new Audio(`/sounds/${note}.mp3`);
    audio
      .play()
      .catch((error) => console.error('음악 재생 중 오류 발생:', error));
    audioRef.current = audio; // 현재 재생 중인 Audio 객체를 ref에 저장
  };

  const handleMouseUp = () => {
    // ref에 저장된 Audio 객체의 재생을 중지
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // 오디오를 처음부터 다시 시작할 수 있도록 현재 시간을 0으로 설정
      audioRef.current = null; // 재생이 끝났으므로 ref를 비움
    }
  };

  return (
    <div
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // 마우스가 키를 벗어날 때도 중지 처리
    />
  );
}
