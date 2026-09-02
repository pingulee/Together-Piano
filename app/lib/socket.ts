import { io, type Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/app/lib/env';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/shared/socket-events';

/** 이벤트 이름과 페이로드가 계약에 묶인 소켓 타입 */
export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * 앱 전체가 공유하는 소켓 하나.
 *
 * 방이 하나뿐이므로 연결도 하나면 충분하고, 모듈 스코프에 두면 컴포넌트가
 * 리렌더되어도 인스턴스가 바뀌지 않아 리스너를 다시 붙일 필요가 없습니다.
 * `autoConnect: false` 이므로 이 모듈을 import 하는 것만으로는 접속하지 않으며,
 * 서버 렌더 중에도 부수효과가 없습니다. 실제 접속은 `SocketConnection` 이 관리합니다.
 */
export const socket: AppSocket = io(SOCKET_URL, {
  autoConnect: false,
  // 합주는 지연에 민감하므로 폴링을 거치지 않고 WebSocket 을 먼저 시도합니다.
  transports: ['websocket', 'polling'],
});
