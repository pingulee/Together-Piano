'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const FALLBACK_IMAGE = '/images/logo.webp';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className='flex w-full items-center justify-center select-none'>
        <div className='bg-sub1 mx-4 rounded-lg p-8 shadow-lg'>
          <Link
            href='/login'
            className='flex min-w-[290px] items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-xl text-black duration-200 hover:bg-white/80'
          >
            Please Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full items-center justify-center select-none'>
      <div className='bg-sub1 mx-4 flex flex-col items-center gap-4 rounded-lg p-8 shadow-lg'>
        <Image
          src={session.user?.image ?? FALLBACK_IMAGE}
          alt={session.user?.name ?? 'Profile'}
          width={100}
          height={100}
          className='rounded-full'
        />
        <div className='text-center text-4xl font-bold'>
          {session.user?.name}
        </div>

        <button
          type='button'
          onClick={() => signOut({ callbackUrl: '/' })}
          className='mt-4 rounded-sm bg-white px-4 py-2 text-lg text-black duration-200 hover:bg-white/80'
        >
          Logout
        </button>
      </div>
    </div>
  );
}
