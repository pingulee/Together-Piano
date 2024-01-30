import React, { useEffect, useRef, useState } from 'react';

interface PianoKeyProps {
  className: string;
  note: string;
}

const PianoKey: React.FC<PianoKeyProps> = ({ className, note }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);

  const [isUserInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    initAudioContext();
    loadAudio(`/sounds/${note}.mp3`);
    return () => {
      audioContextRef.current?.close();
    };
  }, [note]);

  const initAudioContext = () => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
      gainNodeRef.current = audioContextRef.current.createGain();
    }
  };

  const loadAudio = async (url: string) => {
    if (!audioContextRef.current) return;

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContextRef.current.decodeAudioData(
      arrayBuffer,
    );
    bufferRef.current = audioBuffer;
  };

  const playSound = () => {
    if (!audioContextRef.current || !bufferRef.current || isPlayingRef.current)
      return;

    if (audioContextRef.current.state === 'suspended' && isUserInteracted) {
      audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = bufferRef.current;

    // GainNode가 null이 아닌 경우에만 연결
    if (gainNodeRef.current) {
      source.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    // 같은 음을 재생할 때만 fadeOut 적용하지 않음
    if (sourceRef.current && sourceRef.current.buffer === source.buffer) {
      source.start(0);
    } else {
      gainNodeRef.current?.gain.setValueAtTime(
        1,
        audioContextRef.current.currentTime,
      );
      source.start(0);
      sourceRef.current = source;
    }

    isPlayingRef.current = true;
  };

  const fadeOutAudio = () => {
    if (!audioContextRef.current || !gainNodeRef.current || !sourceRef.current)
      return;

    const fadeDuration = 0.25;
    const currentTime = audioContextRef.current.currentTime;

    gainNodeRef.current.gain.setValueAtTime(
      gainNodeRef.current.gain.value,
      currentTime,
    );
    gainNodeRef.current.gain.linearRampToValueAtTime(
      0,
      currentTime + fadeDuration,
    );

    sourceRef.current.stop(currentTime + fadeDuration);
    sourceRef.current = null;
    isPlayingRef.current = false; // 소리가 종료됨을 표시
  };

  const handleUserInteraction = () => {
    setUserInteracted(true);
    if (
      audioContextRef.current &&
      audioContextRef.current.state === 'suspended'
    ) {
      audioContextRef.current.resume();
    }
  };

  return (
    <div
      className={className}
      onMouseDown={() => {
        handleUserInteraction();
        playSound();
      }}
      onMouseUp={fadeOutAudio}
      onTouchEnd={fadeOutAudio}
    />
  );
};

export default PianoKey;
