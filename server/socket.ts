import { randomUUID } from 'node:crypto';
import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

import { CORS_ORIGINS } from './env';
import { colorForId } from '../shared/participant-colors';
import type {
  ChatDraft,
  ClientToServerEvents,
  Participant,
  ServerToClientEvents,
} from '../shared/socket-events';

type IoServer = Server<ClientToServerEvents, ServerToClientEvents>;

/** 표시 이름 최대 길이. 넘치면 잘라 명단 렌더링이 깨지지 않게 합니다. */
const MAX_NAME_LENGTH = 24;
/** 채팅 한 건의 최대 길이 */
const MAX_CONTENT_LENGTH = 500;
/** 국가 코드는 ISO 3166-1 alpha-2 소문자 두 글자 */
const COUNTRY_CODE_PATTERN = /^[a-z]{2}$/;
/** 음 이름은 `c4`, `as3` 형태만 허용합니다. 음원 파일명으로 쓰이기 때문입니다. */
const NOTE_PATTERN = /^[a-g]s?[0-8]$/;

/** 채팅 도배 방지: 창 안에서 허용할 메시지 수 */
const CHAT_RATE_LIMIT = 10;
const CHAT_RATE_WINDOW_MS = 5000;

/** 커서는 초당 30회를 넘겨 받지 않습니다. */
const CURSOR_MIN_INTERVAL_MS = 30;

function normalizeName(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  return trimmed.slice(0, MAX_NAME_LENGTH);
}

function normalizeDraft(input: unknown): ChatDraft | null {
  if (typeof input !== 'object' || input === null) return null;

  const { content, country } = input as Partial<ChatDraft>;
  if (typeof content !== 'string') return null;

  const trimmed = content.trim();
  if (!trimmed) return null;

  return {
    content: trimmed.slice(0, MAX_CONTENT_LENGTH),
    country:
      typeof country === 'string' && COUNTRY_CODE_PATTERN.test(country)
        ? country
        : '',
  };
}

function isValidNote(note: unknown): note is string {
  return typeof note === 'string' && NOTE_PATTERN.test(note);
}

/** 0~1 범위의 유한한 값만 통과시킵니다. */
function normalizeAxis(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.min(Math.max(value, 0), 1);
}

export function createSocketServer(httpServer: HttpServer): IoServer {
  const io: IoServer = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS.length === 1 ? CORS_ORIGINS[0] : CORS_ORIGINS,
      methods: ['GET', 'POST'],
    },
  });

  /** 소켓 id -> 참가자. 프로세스가 하나뿐이므로 메모리에 둡니다. */
  const participants = new Map<string, Participant>();

  const broadcastParticipants = () => {
    io.emit('participants', [...participants.values()]);
  };

  io.on('connection', (socket) => {
    const name = normalizeName(socket.handshake.auth.name);

    // 이름 없이 붙은 연결은 참가자로 다루지 않습니다.
    if (!name) {
      socket.disconnect(true);
      return;
    }

    const self: Participant = {
      id: socket.id,
      name,
      color: colorForId(socket.id),
    };
    participants.set(socket.id, self);

    socket.emit('welcome', self);
    io.emit('system', {
      id: randomUUID(),
      content: `${name} 님이 입장했습니다`,
      sentAt: Date.now(),
    });
    broadcastParticipants();

    let chatWindowStartedAt = 0;
    let chatCountInWindow = 0;
    let lastCursorAt = 0;

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
      participants.delete(socket.id);
      io.emit('cursorLeave', socket.id);
      io.emit('system', {
        id: randomUUID(),
        content: `${name} 님이 나갔습니다`,
        sentAt: Date.now(),
      });
      broadcastParticipants();
    });

    socket.on('requestParticipants', () => {
      socket.emit('participants', [...participants.values()]);
    });

    /**
     * 채팅은 보낸 사람에게도 되돌려 줍니다.
     *
     * 클라이언트가 자기 메시지를 직접 목록에 넣고 서버는 나머지에게만 보내는
     * 방식이면 경로가 둘로 갈려 중복이 생기기 쉽습니다. 서버가 유일한 출처가
     * 되도록 `io.emit` 을 쓰고, 클라이언트는 받은 것만 그립니다.
     */
    socket.on('chat', (input) => {
      if (!isWithinChatRateLimit()) return;

      const draft = normalizeDraft(input);
      if (!draft) return;

      io.emit('chat', {
        id: randomUUID(),
        sender: self.name,
        content: draft.content,
        country: draft.country,
        color: self.color,
        sentAt: Date.now(),
      });
    });

    /**
     * 연주는 보낸 사람을 제외하고 중계합니다.
     *
     * 자기 소리는 이미 로컬에서 즉시 재생했으므로, 서버를 한 바퀴 돌아온 것을
     * 다시 울리면 소리가 겹치고 지연도 그만큼 늘어납니다.
     */
    socket.on('noteOn', (note, velocity) => {
      if (!isValidNote(note)) return;

      const level =
        typeof velocity === 'number' && Number.isFinite(velocity)
          ? Math.min(Math.max(velocity, 0), 1)
          : 0.8;

      socket.broadcast.emit('noteOn', note, level, socket.id);
    });

    socket.on('noteOff', (note) => {
      if (!isValidNote(note)) return;
      socket.broadcast.emit('noteOff', note, socket.id);
    });

    socket.on('sustain', (down) => {
      socket.broadcast.emit('sustain', Boolean(down), socket.id);
    });

    socket.on('cursorMove', (position) => {
      const now = Date.now();
      if (now - lastCursorAt < CURSOR_MIN_INTERVAL_MS) return;
      lastCursorAt = now;

      if (typeof position !== 'object' || position === null) return;

      const x = normalizeAxis(position.x);
      const y = normalizeAxis(position.y);
      if (x === null || y === null) return;

      socket.broadcast.emit('cursorMove', { id: socket.id, x, y });
    });

    socket.on('cursorLeave', () => {
      socket.broadcast.emit('cursorLeave', socket.id);
    });
  });

  return io;
}
