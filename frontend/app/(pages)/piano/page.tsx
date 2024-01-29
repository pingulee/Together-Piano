'use client';

import Chat from '@/app/components/chat/chat.component';
import io, { Socket } from 'socket.io-client';
import PianoContainer from '@/app/components/piano/piano-container.component';
import { getUserIp } from '@/app/hooks/ip/ip.hook';
import { useEffect, useRef, useState } from 'react';

export default function PianoPage() {
  const parentRef = useRef<HTMLDivElement>(null); // 부모 요소를 위한 ref
  const socketRef = useRef<Socket | null>(null);
  const [mousePositions, setMousePositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  useEffect(() => {
    socketRef.current = io('http://192.168.100.83:3288');

    // 마우스 위치 데이터 수신 로직 추가
    socketRef.current.on(
      'mouseMove',
      (data: { id: string; x: number; y: number }) => {
        setMousePositions((prevPositions) => ({
          ...prevPositions,
          [data.id]: { x: data.x, y: data.y },
        }));
      },
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!parentRef.current) return;

      const { left, top, right, bottom } =
        parentRef.current.getBoundingClientRect();
      const x = event.clientX - left + window.scrollX + 80;
      const y = event.clientY - top + window.scrollY;

      // 마우스가 부모 요소 내에 있는지 확인
      if (
        event.clientX >= left &&
        event.clientX <= right &&
        event.clientY >= top &&
        event.clientY <= bottom
      ) {
        // 마우스 위치를 Socket.IO 서버로 전송
        socketRef.current?.emit('mouseMove', { x, y });
      }
    };

    const element = parentRef.current;
    element?.addEventListener('mousemove', handleMouseMove);

    return () => {
      element?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className='flex flex-grow-7 w-full piano-cursor items-center justify-center'
    >
      {Object.entries(mousePositions).map(([id, pos]) => (
        <div
          key={id}
          className='absolute bg-blue-500 rounded-full'
          style={{
            width: '10px',
            height: '10px',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            zIndex: '30',
          }}
        />
      ))}
      <PianoContainer />
      <Chat />
    </div>
  );
}
