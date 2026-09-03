import type { Metadata } from 'next';

import RoomLobby from '@/app/components/room-lobby';
import SocketConnection from '@/app/providers/socket-connection';

export const metadata: Metadata = {
  title: '연주실',
};

/**
 * 로비.
 *
 * `room` 을 비워 접속하면 서버가 연주 이벤트를 등록하지 않고 방 목록만 보내
 * 줍니다. 목록을 위해 아무 방에나 들어가 있는 상태가 되지 않습니다.
 */
export default function PianoLobbyPage() {
  return (
    <SocketConnection room=''>
      <RoomLobby />
    </SocketConnection>
  );
}
