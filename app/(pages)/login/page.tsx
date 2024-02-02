'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <div className='flex flex-col p-8 bg-sub1 rounded-lg mx-4'>
        <div className='flex flex-col gap-4 justify-between items-center'>
          {/* 구글 로그인 버튼 */}
          <div
            className='flex items-center space-x-2 min-w-[220px] px-4 py-2 rounded-md gap-2 duration-200 text-lg bg-white text-black cursor-pointer hover:bg-opacity-80'
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <FcGoogle />
            Sign in with Google
          </div>

          {/* 디스코드 로그인 버튼 */}
          <div
            className='flex items-center space-x-2 min-w-[220px] px-4 py-2 rounded-md gap-2 duration-200 text-lg bg-[#5165f8] text-white cursor-pointer hover:bg-opacity-80'
            onClick={() => signIn('discord', { callbackUrl: '/' })}
          >
            <FaDiscord />
            Sign in with Discord
          </div>
        </div>
      </div>
    </div>
  );
}
