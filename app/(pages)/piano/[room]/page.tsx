import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Chat from '@/app/components/chat';
import PianoStage from '@/app/components/piano-stage';
import SocketConnection from '@/app/providers/socket-connection';
import { normalizeRoomId } from '@/shared/room';

interface RoomPageProps {
  params: Promise<{ room: string }>;
}

/** 경로 조각을 방 이름으로 되돌립니다. 한글·공백이 들어갈 수 있어 디코딩이 필요합니다. */
function readRoomId(segment: string): string | null {
  try {
    return normalizeRoomId(decodeURIComponent(segment));
  } catch {
    // 잘못 인코딩된 링크입니다.
    return null;
  }
}

export async function generateMetadata({
  params,
}: RoomPageProps): Promise<Metadata> {
  const { room } = await params;
  const roomId = readRoomId(room);

  return { title: roomId ? `${roomId} 연주실` : '연주실' };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { room } = await params;
  const roomId = readRoomId(room);

  // 정규화 후 남는 게 없는 이름은 방으로 쓸 수 없습니다. 빈 방에 접속시키면
  // 서버가 로비 접속으로 취급해 연주가 아무에게도 가지 않습니다.
  if (!roomId) notFound();

  return (
    <SocketConnection room={roomId}>
      <PianoStage roomId={roomId} />
      <Chat />
    </SocketConnection>
  );
}
