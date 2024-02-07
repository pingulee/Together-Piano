import NextAuth, { User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

// 사용자 정의 타입을 확장하여 새로운 'test' 속성을 추가
interface ExtendedUser extends User {
  signUpDate?: string; // 사이트 최초 접속일
  color?: string; // 색상
}

const clientPromise = MongoClient.connect(
  process.env.MONGODB_URI ??
    'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/togetherpiano',
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user }) {
      const extendedUser = user as ExtendedUser;
      extendedUser.signUpDate = 'a';
      extendedUser.color = '#a';
      return true;
    },
  },
});

export { handler as GET, handler as POST };
