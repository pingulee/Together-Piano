import { randomUUID } from 'node:crypto';
import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';

import { CORS_ORIGINS } from './env';
import { colorForId, isParticipantColor } from '../shared/participant-colors';
import { ROOM_CAPACITY, normalizeRoomId } from '../shared/room';
import type {
  ChatDraft,
  ClientToServerEvents,
  Participant,
  RoomSummary,
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

/** 프로필 변경도 방 전체 브로드캐스트를 유발하므로 빈도를 제한합니다. */
const PROFILE_MIN_INTERVAL_MS = 500;

/** 커서는 초당 30회를 넘겨 받지 않습니다. */
const CURSOR_MIN_INTERVAL_MS = 30;

/** 로비 접속자가 모여 있는 채널. 방 목록만 받습니다. */
const LOBBY_CHANNEL = 'lobby';

/** 방 채널 이름. 로비나 다른 내부 채널과 겹치지 않게 접두사를 붙입니다. */
function roomChannel(roomId: string): string {
  return `room:${roomId}`;
}

/**
 * 방 하나의 상태.
 *
 * `members` 는 Map 이라 입장 순서가 보존됩니다. 방장이 나갈 때 남은 사람 중
 * 가장 먼저 들어온 사람에게 넘기려면 이 순서가 필요합니다.
 */
interface RoomState {
  id: string;
  hostId: string | null;
  locked: boolean;
  members: Map<string, Participant>;
}

function normalizeName(input: unknown): string | null {
  if (typeof input !== 'string') return null;

  const trimmed = input.replace(/\s+/g, ' ').trim();
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

/**
 * 명단 스냅샷.
 *
 * `isHost` 를 저장하지 않고 보낼 때 계산합니다. 저장해 두면 방장이 바뀔 때마다
 * 모든 참가자 객체를 손봐야 하고, 한 군데를 빠뜨리면 방장이 둘로 보입니다.
 */
function snapshot(room: RoomState): Participant[] {
  return [...room.members.values()].map((member) => ({
    ...member,
    isHost: member.id === room.hostId,
  }));
}

function summarize(room: RoomState): RoomSummary {
  return {
    id: room.id,
    count: room.members.size,
    hostName: room.hostId ? (room.members.get(room.hostId)?.name ?? '') : '',
    locked: room.locked,
  };
}

export function createSocketServer(httpServer: HttpServer): IoServer {
  const io: IoServer = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS.length === 1 ? CORS_ORIGINS[0] : CORS_ORIGINS,
      methods: ['GET', 'POST'],
    },
  });

  /** 방 이름 -> 상태. 프로세스가 하나뿐이므로 메모리에 둡니다. */
  const rooms = new Map<string, RoomState>();

  const roomSummaries = (): RoomSummary[] => [...rooms.values()].map(summarize);

  const announceRooms = () => {
    io.to(LOBBY_CHANNEL).emit('rooms', roomSummaries());
  };

  const announceMembers = (room: RoomState) => {
    io.to(roomChannel(room.id)).emit('participants', snapshot(room));
    announceRooms();
  };

  const announceRoomInfo = (room: RoomState) => {
    io.to(roomChannel(room.id)).emit('room', {
      id: room.id,
      hostId: room.hostId,
      locked: room.locked,
    });
  };

  const announceSystem = (room: RoomState, content: string) => {
    io.to(roomChannel(room.id)).emit('system', {
      id: randomUUID(),
      content,
      sentAt: Date.now(),
    });
  };

  io.on('connection', (socket) => {
    const name = normalizeName(socket.handshake.auth.name);

    // 이름 없이 붙은 연결은 참가자로 다루지 않습니다.
    if (!name) {
      socket.disconnect(true);
      return;
    }

    const roomId = normalizeRoomId(socket.handshake.auth.room);

    // --- 로비 -------------------------------------------------------------
    //
    // 방에 들어가지 않고 목록만 보는 접속입니다. 연주·채팅 이벤트를 등록하지
    // 않으므로, 로비에서 보낸 타건이 어느 방에도 새지 않습니다.
    if (!roomId) {
      socket.join(LOBBY_CHANNEL);
      socket.emit('rooms', roomSummaries());
      socket.on('listRooms', () => {
        socket.emit('rooms', roomSummaries());
      });
      return;
    }

    // --- 방 입장 ----------------------------------------------------------

    let room = rooms.get(roomId);
    if (!room) {
      // 없는 방에 들어가면 그 자리에서 만들어지고 만든 사람이 방장이 됩니다.
      room = {
        id: roomId,
        hostId: socket.id,
        locked: false,
        members: new Map(),
      };
      rooms.set(roomId, room);
    }

    if (room.locked) {
      socket.emit('joinRejected', 'locked');
      socket.disconnect(true);
      return;
    }

    if (room.members.size >= ROOM_CAPACITY) {
      socket.emit('joinRejected', 'full');
      socket.disconnect(true);
      return;
    }

    const self: Participant = {
      id: socket.id,
      name,
      // 팔레트에 없는 색은 무시하고 id 기반 기본값을 씁니다.
      color: isParticipantColor(socket.handshake.auth.color)
        ? socket.handshake.auth.color
        : colorForId(socket.id),
      isHost: room.hostId === socket.id,
    };

    const channel = roomChannel(roomId);
    const activeRoom = room;

    activeRoom.members.set(socket.id, self);
    socket.join(channel);

    socket.emit('welcome', {
      ...self,
      isHost: activeRoom.hostId === socket.id,
    });
    announceRoomInfo(activeRoom);
    announceSystem(activeRoom, `${self.name} 님이 입장했습니다`);
    announceMembers(activeRoom);

    let chatWindowStartedAt = 0;
    let chatCountInWindow = 0;
    let lastCursorAt = 0;
    let lastProfileAt = 0;

    const isWithinChatRateLimit = () => {
      const now = Date.now();
      if (now - chatWindowStartedAt > CHAT_RATE_WINDOW_MS) {
        chatWindowStartedAt = now;
        chatCountInWindow = 0;
      }
      chatCountInWindow += 1;
      return chatCountInWindow <= CHAT_RATE_LIMIT;
    };

    const isHost = () => activeRoom.hostId === socket.id;

    socket.on('disconnect', () => {
      activeRoom.members.delete(socket.id);
      io.to(channel).emit('cursorLeave', socket.id);
      announceSystem(activeRoom, `${self.name} 님이 나갔습니다`);

      if (activeRoom.members.size === 0) {
        // 빈 방은 남겨 두지 않습니다. 목록에 유령 방이 쌓이고, 잠금 상태가
        // 남아 같은 이름으로 다시 들어갈 수 없게 됩니다.
        rooms.delete(activeRoom.id);
        announceRooms();
        return;
      }

      if (activeRoom.hostId === socket.id) {
        // 남은 사람 중 가장 먼저 들어온 사람이 이어받습니다.
        const [nextHostId] = activeRoom.members.keys();
        activeRoom.hostId = nextHostId;

        const nextHost = activeRoom.members.get(nextHostId);
        if (nextHost) {
          announceSystem(activeRoom, `${nextHost.name} 님이 방장이 되었습니다`);
        }
        announceRoomInfo(activeRoom);
      }

      announceMembers(activeRoom);
    });

    socket.on('requestParticipants', () => {
      socket.emit('participants', snapshot(activeRoom));
    });

    /**
     * 닉네임·색 변경.
     *
     * 핸드셰이크로만 받으면 이름을 고칠 때마다 재접속해야 하고, 그 사이 울리던
     * 음이 끊기고 채팅 기록도 날아갑니다. 별도 이벤트로 받아 방 안에서 갱신합니다.
     */
    socket.on('updateProfile', (profile) => {
      const now = Date.now();
      if (now - lastProfileAt < PROFILE_MIN_INTERVAL_MS) return;
      lastProfileAt = now;

      if (typeof profile !== 'object' || profile === null) return;

      const nextName = normalizeName(profile.name);
      if (nextName) self.name = nextName;
      if (isParticipantColor(profile.color)) self.color = profile.color;

      activeRoom.members.set(socket.id, self);
      socket.emit('welcome', { ...self, isHost: isHost() });
      announceMembers(activeRoom);
    });

    socket.on('kick', (targetId) => {
      if (!isHost()) return;
      if (typeof targetId !== 'string' || targetId === socket.id) return;

      const target = activeRoom.members.get(targetId);
      if (!target) return;

      const targetSocket = io.sockets.sockets.get(targetId);
      if (!targetSocket) return;

      announceSystem(activeRoom, `${target.name} 님이 내보내졌습니다`);
      targetSocket.emit('kicked');
      // disconnect 핸들러가 명단·목록 정리를 이어서 합니다.
      targetSocket.disconnect(true);
    });

    socket.on('setLocked', (locked) => {
      if (!isHost()) return;

      activeRoom.locked = Boolean(locked);
      announceRoomInfo(activeRoom);
      announceSystem(
        activeRoom,
        activeRoom.locked ? '방이 잠겼습니다' : '방 잠금이 풀렸습니다',
      );
      announceRooms();
    });

    /**
     * 채팅은 보낸 사람에게도 되돌려 줍니다.
     *
     * 클라이언트가 자기 메시지를 직접 목록에 넣고 서버는 나머지에게만 보내는
     * 방식이면 경로가 둘로 갈려 중복이 생기기 쉽습니다. 서버가 유일한 출처가
     * 되도록 `io.to(channel)` 을 쓰고, 클라이언트는 받은 것만 그립니다.
     */
    socket.on('chat', (input) => {
      if (!isWithinChatRateLimit()) return;

      const draft = normalizeDraft(input);
      if (!draft) return;

      io.to(channel).emit('chat', {
        id: randomUUID(),
        sender: self.name,
        content: draft.content,
        country: draft.country,
        color: self.color,
        sentAt: Date.now(),
      });
    });

    /**
     * 연주는 보낸 사람을 제외하고 같은 방에만 중계합니다.
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

      socket.to(channel).emit('noteOn', note, level, socket.id);
    });

    socket.on('noteOff', (note) => {
      if (!isValidNote(note)) return;
      socket.to(channel).emit('noteOff', note, socket.id);
    });

    socket.on('sustain', (down) => {
      socket.to(channel).emit('sustain', Boolean(down), socket.id);
    });

    socket.on('cursorMove', (position) => {
      const now = Date.now();
      if (now - lastCursorAt < CURSOR_MIN_INTERVAL_MS) return;
      lastCursorAt = now;

      if (typeof position !== 'object' || position === null) return;

      const x = normalizeAxis(position.x);
      const y = normalizeAxis(position.y);
      if (x === null || y === null) return;

      socket.to(channel).emit('cursorMove', { id: socket.id, x, y });
    });

    socket.on('cursorLeave', () => {
      socket.to(channel).emit('cursorLeave', socket.id);
    });
  });

  return io;
}
