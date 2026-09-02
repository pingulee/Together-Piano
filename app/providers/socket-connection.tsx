'use client';

import { useSession } from 'next-auth/react';
import { useEffect, type ReactNode } from 'react';

import { socket } from '@/app/lib/socket';

const ANONYMOUS_NAME = 'Anonymous';

/**
 * 공유 소켓의 접속 수명주기를 담당합니다.
 *
 * 세션 조회가 끝난 뒤에 접속해, 이름이 'Anonymous' -> 실제 이름으로 바뀌면서
 * 곧바로 재접속하는 것을 막습니다. 자식들은 `socket` 을 직접 import 해 쓰므로
 * 연결 준비 여부를 확인할 필요가 없습니다. (socket.io 가 접속 전 emit 을 큐에 담습니다)
 */
export default function SocketConnection({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();

  const name = session?.user?.name ?? ANONYMOUS_NAME;
  const isSessionResolved = status !== 'loading';

  useEffect(() => {
    if (!isSessionResolved) return;

    socket.auth = { name };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [isSessionResolved, name]);

  return children;
}
