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

/** 접속자 한 명. `color` 는 서버가 배정하며 커서·명단·건반 강조에 같은 값을 씁니다. */
export interface Participant {
  id: string;
  name: string;
  color: string;
}

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
}

export interface ClientToServerEvents {
  requestParticipants: () => void;
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
}
