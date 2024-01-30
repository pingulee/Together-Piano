import React, { useEffect, useRef, useState } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

/**
 * 피아노 키 컴포넌트를 웹 오디오 API를 사용하여 구현합니다.
 * @param {PianoKeyProps} props - 피아노 키 속성
 */
const PianoKey: React.FC<PianoKeyProps> = ({ className, note }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);

  useEffect(() => {
    // 오디오 컨텍스트와 버퍼 초기화
    const context = new AudioContext();
    setAudioContext(context);
    loadAudio(context, `/sounds/${note}.mp3`);

    return () => {
      context.close(); // 컴포넌트 언마운트 시 오디오 컨텍스트 닫기
    };
  }, [note]);

  /**
   * 오디오 파일을 불러오고 버퍼에 저장합니다.
   * @param {AudioContext} context - 오디오 컨텍스트
   * @param {string} url - 오디오 파일 URL
   */
  const loadAudio = async (context: AudioContext, url: string) => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    setBuffer(audioBuffer);
  };

  /**
   * 오디오를 재생합니다.
   */
  const playSound = () => {
    if (audioContext && buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      if (audioContext.state === 'suspended') {
        audioContext.resume(); // 오디오 컨텍스트가 중단된 상태인 경우 재개
      }
      source.start(0);
    }
  };

  return (
    <div
      className={className}
      onMouseDown={playSound}
      // fadeOutAudio 기능은 복잡성을 고려하여 생략하거나, 필요에 따라 별도로 구현해야 합니다.
    />
  );
};

export default PianoKey;
