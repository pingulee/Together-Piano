import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';
import User from '@/shared/models/user.model';
import { connectDatabase } from '@/shared/lib/database';

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
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDatabase();

      // 사용자가 데이터베이스에 있는지 확인
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        // 기존 사용자: lastLogin 업데이트
        existingUser.lastLogin = new Date();
        await existingUser.save();
      } else {
        // 새 사용자: 유저 생성
        const newUser = new User({
          email: user.email,
          username: user.name,
          bio: '',
          signUpDate: new Date(),
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // 랜덤 컬러 생성
        });
        await newUser.save();
      }

      return true; // 로그인 성공
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
