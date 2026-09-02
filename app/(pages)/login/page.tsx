'use client';

import { signIn } from 'next-auth/react';
import { FaDiscord } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const CALLBACK_URL = '/';

export default function LoginPage() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='bg-sub1 mx-4 flex flex-col gap-4 rounded-lg p-8'>
        <button
          type='button'
          onClick={() => signIn('google', { callbackUrl: CALLBACK_URL })}
          className='flex min-w-[220px] items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-lg text-black duration-200 hover:bg-white/80'
        >
          <FcGoogle />
          Sign in with Google
        </button>

        <button
          type='button'
          onClick={() => signIn('discord', { callbackUrl: CALLBACK_URL })}
          className='flex min-w-[220px] items-center justify-center gap-2 rounded-md bg-[#5165f8] px-4 py-2 text-lg text-white duration-200 hover:bg-[#5165f8]/80'
        >
          <FaDiscord />
          Sign in with Discord
        </button>
      </div>
    </div>
  );
}
