import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth, { type AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

import { db } from '@/shared/db/client';
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from '@/shared/db/schema';

type Provider = NonNullable<AuthOptions['providers']>[number];

/**
 * 자격 증명이 갖춰진 제공자만 등록합니다.
 *
 * 로그인은 선택 기능이므로, 한 제공자의 설정이 비어 있다고 서버 전체가
 * 뜨지 못하게 만들지 않습니다. 대신 그 제공자만 사용할 수 없습니다.
 */
function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (googleId && googleSecret) {
    providers.push(
      GoogleProvider({ clientId: googleId, clientSecret: googleSecret }),
    );
  }

  const discordId = process.env.DISCORD_CLIENT_ID;
  const discordSecret = process.env.DISCORD_CLIENT_SECRET;
  if (discordId && discordSecret) {
    providers.push(
      DiscordProvider({ clientId: discordId, clientSecret: discordSecret }),
    );
  }

  return providers;
}

/**
 * 세션 쿠키 서명에 쓰이므로 비어 있으면 안 됩니다.
 * 값이 바뀌면 기존 로그인 세션이 모두 무효화됩니다.
 */
function requireSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      'NEXTAUTH_SECRET 이 설정되지 않았습니다. `openssl rand -base64 32` 로 만들어 넣으세요.',
    );
  }
  return secret;
}

export const authOptions: AuthOptions = {
  providers: buildProviders(),
  secret: requireSecret(),
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as AuthOptions['adapter'],
  callbacks: {
    session({ session, user }) {
      // 어댑터가 만든 사용자 ID 를 클라이언트 세션에서도 쓸 수 있게 넘겨줍니다.
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
