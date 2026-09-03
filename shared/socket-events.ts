/**
 * 소켓 이벤트 계약.
 *
 * 클라이언트(`app/`)와 서버(`server/`)가 함께 참조하는 유일한 정의이므로,
 * 이벤트 이름이나 페이로드를 바꿀 때는 이 파일만 고치면 양쪽에 타입 오류로 드러납니다.
 *
 * 런타임 값을 넣지 마세요. 서버 빌드는 이 파일을 타입 전용으로만 가져갑니다.
 */

/** 음원 파일명과 동일한 음 이름 (예: `c4`, `as3`) */
export type NoteName = string;

/**
 * 접속자 한 명.
 *
 * `name` 과 `color` 는 참가자가 직접 고르며 서버가 검증합니다. 색은 팔레트에
 * 있는 값만 통과하므로 커서·건반의 인라인 스타일에 그대로 넣어도 안전합니다.
 */
export interface Participant {
  id: string;
  name: string;
  color: string;
  /** 방장 여부. 강퇴·잠금 버튼 노출을 이 값으로 정합니다. */
  isHost: boolean;
}

/** 지금 들어와 있는 방의 상태 */
export interface RoomInfo {
  id: string;
  /** 방장 소켓 id. 방이 비는 순간에만 `null` 입니다. */
  hostId: string | null;
  /** 잠긴 방에는 새 참가자가 들어오지 못합니다. */
  locked: boolean;
}

/** 로비 목록에 한 줄로 보여 줄 방 요약 */
export interface RoomSummary {
  id: string;
  count: number;
  hostName: string;
  locked: boolean;
}

/** 참가자가 바꿀 수 있는 자기 정보 */
export interface ProfileUpdate {
  name: string;
  color: string;
}

/** 입장이 거절된 이유 */
export type JoinRejection = 'invalid-room' | 'locked' | 'full';

/**
 * 채팅 메시지.
 *
 * `id` 는 서버가 붙입니다. 보낸 사람에게도 서버가 그대로 되돌려 주므로
 * 클라이언트가 자기 메시지를 따로 추가하지 않아 중복이 생기지 않습니다.
 */
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  /** ISO 3166-1 alpha-2 국가 코드(소문자). 조회에 실패하면 빈 문자열입니다. */
  country: string;
  /** 보낸 참가자의 색. 이름 옆 표시에 씁니다. */
  color: string;
  /** epoch milliseconds */
  sentAt: number;
}

/** 클라이언트가 서버로 보내는 채팅 초안 (id·색·시각은 서버가 채웁니다) */
export interface ChatDraft {
  content: string;
  country: string;
}

/** 입·퇴장 등 서버가 만들어 보내는 안내 메시지 */
export interface SystemMessage {
  id: string;
  content: string;
  sentAt: number;
}

/**
 * 커서 위치. 두 축 모두 0~1 로 정규화한 값입니다.
 *
 * 기준은 피아노 페이지의 무대(stage) 영역이며, 모든 참가자가 같은 레이아웃을
 * 보므로 정규화 좌표가 서로 같은 지점을 가리킵니다. 창 비율이 크게 다르면
 * 약간의 오차가 생길 수 있습니다.
 */
export interface CursorPosition {
  x: number;
  y: number;
}

/** 다른 참가자의 커서 */
export interface RemoteCursor extends CursorPosition {
  id: string;
}

export interface ServerToClientEvents {
  /** 접속 직후 자기 자신의 정보. 커서 오버레이에서 자신을 걸러내는 데 씁니다. */
  welcome: (self: Participant) => void;
  participants: (participants: Participant[]) => void;
  /** 방장·잠금 상태가 바뀔 때마다 방 전체에 다시 보냅니다. */
  room: (info: RoomInfo) => void;
  /** 로비에 접속한 클라이언트에게만 갑니다. */
  rooms: (rooms: RoomSummary[]) => void;

  chat: (message: ChatMessage) => void;
  system: (message: SystemMessage) => void;

  /** `velocity` 는 0~1. `from` 은 누른 참가자 id 로, 건반을 그 사람 색으로 켭니다. */
  noteOn: (note: NoteName, velocity: number, from: string) => void;
  noteOff: (note: NoteName, from: string) => void;
  /** 서스테인 페달. 참가자별로 따로 관리합니다. */
  sustain: (down: boolean, from: string) => void;

  cursorMove: (cursor: RemoteCursor) => void;
  /** 커서가 무대를 벗어났거나 참가자가 나갔습니다. */
  cursorLeave: (id: string) => void;

  /** 입장 거절. 곧바로 연결이 끊기므로 클라이언트는 로비로 돌아갑니다. */
  joinRejected: (reason: JoinRejection) => void;
  /** 방장이 내보냈습니다. */
  kicked: () => void;
}

export interface ClientToServerEvents {
  requestParticipants: () => void;
  /** 로비 목록 갱신 요청 */
  listRooms: () => void;
  /** 닉네임·색 변경. 재접속 없이 방 전체에 반영됩니다. */
  updateProfile: (profile: ProfileUpdate) => void;
  /** 방장만 유효합니다. */
  kick: (targetId: string) => void;
  /** 방장만 유효합니다. */
  setLocked: (locked: boolean) => void;

  chat: (draft: ChatDraft) => void;
  noteOn: (note: NoteName, velocity: number) => void;
  noteOff: (note: NoteName) => void;
  sustain: (down: boolean) => void;
  cursorMove: (position: CursorPosition) => void;
  cursorLeave: () => void;
}

/** 접속 시 전달하는 핸드셰이크 정보 */
export interface SocketHandshakeAuth {
  name: string;
  color: string;
  /** 빈 문자열이면 어느 방에도 들어가지 않고 로비 목록만 받습니다. */
  room: string;
}
