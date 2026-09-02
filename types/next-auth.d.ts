import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /** 어댑터가 발급한 사용자 ID 를 세션에 노출합니다. */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
