import React, { useEffect, useRef } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

/**
 * 피아노 키 컴포넌트
 * @param {PianoKeyProps} props - 피아노 키 속성
 */
export default function PianoKey({ className, note }: PianoKeyProps) {
  const audioRef = useRef<HTMLAudioElement>(new Audio(`/sounds/${note}.mp3`));

  useEffect(() => {
    const audio = audioRef.current;
    audio.load(); // 컴포넌트 마운트 시 오디오 파일 미리 로드

    return () => {
      audio.pause(); // 컴포넌트 언마운트 시 오디오 정지
    };
  }, [note]);

  const handleMouseDown = () => {
    const audio = audioRef.current;
    if (audio.paused || audio.currentTime) {
      audio.currentTime = 0; // 이미 재생 중이거나 재생이 중단된 경우, 오디오를 처음부터 다시 시작
    }
    audio.play().catch((error) => console.error('음악 재생 중 오류 발생:', error));
  };

  const fadeOutAudio = (audio: HTMLAudioElement) => {
    let volume = 1.0; // 시작 볼륨 (0.0 ~ 1.0)
    const fadeOutInterval = setInterval(() => {
      if (volume > 0.1) {
        volume -= 0.1;
        audio.volume = volume;
      } else {
        clearInterval(fadeOutInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1.0; // 볼륨 초기화
      }
    }, 50);
  };

  const handleMouseUp = () => {
    fadeOutAudio(audioRef.current);
  };

  return (
    <div
      className={className}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}
