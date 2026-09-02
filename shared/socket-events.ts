/**
 * 소켓 이벤트 계약.
 *
 * 클라이언트(`app/`)와 서버(`server/`)가 함께 참조하는 유일한 정의이므로,
 * 이벤트 이름이나 페이로드를 바꿀 때는 이 파일만 고치면 양쪽에 타입 오류로 드러납니다.
 *
 * 런타임 값을 넣지 마세요. 서버 빌드는 이 파일을 타입 전용으로만 가져갑니다.
 */

/** 사용자가 보낸 채팅 메시지 */
export interface ChatMessage {
  sender: string;
  content: string;
  /** ISO 3166-1 alpha-2 국가 코드(소문자). 조회에 실패하면 빈 문자열입니다. */
  country: string;
}

/** 입·퇴장 등 서버가 만들어 보내는 안내 메시지 */
export interface SystemMessage {
  content: string;
}

/** 음원 파일명과 동일한 음 이름 (예: `c4`, `as3`) */
export type NoteName = string;

export interface ServerToClientEvents {
  message: (message: ChatMessage) => void;
  system: (message: SystemMessage) => void;
  userList: (users: string[]) => void;
  userCount: (count: number) => void;
  playNote: (note: NoteName) => void;
}

export interface ClientToServerEvents {
  message: (message: ChatMessage) => void;
  requestUserList: () => void;
  playNote: (note: NoteName) => void;
}

/** 접속 시 전달하는 핸드셰이크 정보 */
export interface SocketHandshakeAuth {
  name: string;
}
