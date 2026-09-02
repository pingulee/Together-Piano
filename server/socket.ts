import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

import { CORS_ORIGINS } from './env';
import type {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../shared/socket-events';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents>;

/** 표시 이름 최대 길이. 넘치면 잘라 명단 렌더링이 깨지지 않게 합니다. */
const MAX_NAME_LENGTH = 32;
/** 채팅 한 건의 최대 길이 */
const MAX_CONTENT_LENGTH = 1000;
/** 국가 코드는 ISO 3166-1 alpha-2 소문자 두 글자 */
const COUNTRY_CODE_PATTERN = /^[a-z]{2}$/;

/** 채팅 도배 방지: 창 안에서 허용할 메시지 수 */
const CHAT_RATE_LIMIT = 10;
const CHAT_RATE_WINDOW_MS = 5000;

/**
 * 클라이언트가 보낸 값은 신뢰할 수 없으므로 경계에서 정규화합니다.
 * 형식이 어긋나면 조용히 버리고 연결은 유지합니다.
 */
function normalizeMessage(input: unknown, sender: string): ChatMessage | null {
  if (typeof input !== 'object' || input === null) return null;

  const { content, country } = input as Partial<ChatMessage>;
  if (typeof content !== 'string') return null;

  const trimmed = content.trim();
  if (!trimmed) return null;

  return {
    // 보낸 사람은 핸드셰이크에서 확인한 이름으로 덮어씁니다.
    sender,
    content: trimmed.slice(0, MAX_CONTENT_LENGTH),
    country:
      typeof country === 'string' && COUNTRY_CODE_PATTERN.test(country)
        ? country
        : '',
  };
}

function normalizeName(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  return trimmed.slice(0, MAX_NAME_LENGTH);
}

export function createSocketServer(httpServer: HttpServer): IoServer {
  const io: IoServer = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS.length === 1 ? CORS_ORIGINS[0] : CORS_ORIGINS,
      methods: ['GET', 'POST'],
    },
  });

  /** 소켓 ID -> 표시 이름. 프로세스가 하나뿐이므로 메모리에 둡니다. */
  const connectedUsers = new Map<string, string>();

  const broadcastRoster = () => {
    const users = [...connectedUsers.values()];
    io.emit('userList', users);
    io.emit('userCount', users.length);
  };

  io.on('connection', (socket) => {
    const name = normalizeName(socket.handshake.auth.name);

    // 이름 없이 붙은 연결은 명단에 넣지 않고 끊습니다.
    if (!name) {
      socket.disconnect(true);
      return;
    }

    connectedUsers.set(socket.id, name);
    io.emit('system', { content: `${name} has joined` });
    broadcastRoster();

    let chatWindowStartedAt = 0;
    let chatCountInWindow = 0;

    const isWithinChatRateLimit = () => {
      const now = Date.now();
      if (now - chatWindowStartedAt > CHAT_RATE_WINDOW_MS) {
        chatWindowStartedAt = now;
        chatCountInWindow = 0;
      }
      chatCountInWindow += 1;
      return chatCountInWindow <= CHAT_RATE_LIMIT;
    };

    socket.on('disconnect', () => {
      connectedUsers.delete(socket.id);
      io.emit('system', { content: `${name} has left` });
      broadcastRoster();
    });

    socket.on('requestUserList', () => {
      socket.emit('userList', [...connectedUsers.values()]);
    });

    socket.on('playNote', (note) => {
      // 음 이름은 음원 파일명으로 쓰이므로 형식이 맞는 것만 중계합니다.
      if (typeof note !== 'string' || !/^[a-g]s?[0-8]$/.test(note)) return;
      socket.broadcast.emit('playNote', note);
    });

    socket.on('message', (input) => {
      if (!isWithinChatRateLimit()) return;

      const message = normalizeMessage(input, name);
      if (message) socket.broadcast.emit('message', message);
    });
  });

  return io;
}
