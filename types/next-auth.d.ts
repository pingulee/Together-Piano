import 'next-auth';

declare module 'next-auth' {
  /**
   * NextAuth의 `session` 객체에 사용자 정의 속성을 추가하기 위해 `Session` 인터페이스를 확장합니다.
   */
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
