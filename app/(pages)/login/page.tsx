'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

export default function SettingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className='flex items-center justify-center w-full'>
      <div>
        <div
          className='flex items-center px-4 py-2 space-x-2 rounded-md bg-blue-500 text-white cursor-pointer'
          onClick={() => signIn('google', { callbackUrl: '/' })}
        >
          <FaGoogle /> Google 로그인
        </div>
        <div
          className='flex items-center px-4 py-2 space-x-2 rounded-md bg-blue-500 text-white cursor-pointer'
          onClick={() => signIn('discord', { callbackUrl: '/' })}
        >
          <FaDiscord /> Discord 로그인
        </div>
      </div>
    </div>
  );
}
