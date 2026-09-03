'use client';

import { useEffect, useState } from 'react';

import { socket } from '@/app/lib/socket';
import type { RoomSummary } from '@/shared/socket-events';

/**
 * 열려 있는 방 목록.
 *
 * 서버가 인원이 바뀔 때마다 로비 채널로 다시 보내므로 폴링하지 않습니다.
 * 재접속 직후에는 놓친 브로드캐스트가 있을 수 있어 한 번 요청합니다.
 */
export function useRooms(): RoomSummary[] {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);

  useEffect(() => {
    const handleRooms = (next: RoomSummary[]) => {
      // 사람이 많은 방을 위로, 같으면 이름순으로 놓아 순서가 튀지 않게 합니다.
      setRooms(
        next.toSorted(
          (a, b) => b.count - a.count || a.id.localeCompare(b.id, 'ko'),
        ),
      );
    };

    socket.on('rooms', handleRooms);
    socket.on('connect', requestRooms);
    if (socket.connected) requestRooms();

    return () => {
      socket.off('rooms', handleRooms);
      socket.off('connect', requestRooms);
    };
  }, []);

  return rooms;
}

function requestRooms(): void {
  socket.emit('listRooms');
}
