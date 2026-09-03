'use client';

import { useSession } from 'next-auth/react';
import { useEffect, type ReactNode } from 'react';

import { useIdentity } from '@/app/hooks/use-identity';
import {
  getIdentity,
  hasChosenIdentity,
  setIdentity,
} from '@/app/lib/identity';
import { socket } from '@/app/lib/socket';

interface SocketConnectionProps {
  /** 들어갈 방. 빈 문자열이면 로비(방 목록만 받는 접속)입니다. */
  room: string;
  children: ReactNode;
}

/**
 * 공유 소켓의 접속 수명주기를 담당합니다.
 *
 * 접속은 방이 바뀔 때만 다시 맺습니다. 닉네임·색은 `updateProfile` 로 보내므로
 * 이름을 고치는 동안 소리가 끊기거나 채팅이 날아가지 않습니다.
 */
export default function SocketConnection({
  room,
  children,
}: SocketConnectionProps) {
  const identity = useIdentity();
  const { data: session, status } = useSession();

  const sessionName = session?.user?.name ?? null;
  const isSessionResolved = status !== 'loading';

  // 아직 이름을 직접 정하지 않았다면 로그인 이름을 기본값으로 채웁니다.
  useEffect(() => {
    if (!sessionName || hasChosenIdentity()) return;
    setIdentity({ name: sessionName }, { seed: true });
  }, [sessionName]);

  useEffect(() => {
    // 세션 조회가 끝난 뒤에 붙어, 기본 이름으로 붙었다가 곧 재접속하는 것을 막습니다.
    if (!isSessionResolved) return;

    const current = getIdentity();
    socket.auth = { name: current.name, color: current.color, room };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [isSessionResolved, room]);

  // 이미 붙어 있는 동안의 변경을 반영합니다. 접속 전 emit 은 socket.io 가 큐에 담습니다.
  useEffect(() => {
    socket.emit('updateProfile', identity);
  }, [identity]);

  return children;
}
