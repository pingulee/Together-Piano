'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className='flex items-center justify-center w-full'>
        <div className='text-center'>
          <p className='text-xl'>Please Login.</p>
          <div
            className='mt-4 px-4 py-2 bg-white text-white rounded hover:bg-highlight'
            onClick={() => signIn()}
          >
            로그인하기
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center w-full'>
      <div className='flex flex-col p-8 bg-sub1 rounded-lg shadow-lg mx-4'>
        <div className='flex flex-col gap-4 justify-between items-center'>
          <Image
            src={session.user?.image || '/images/logo.webp'}
            alt='Profile Picture'
            width={100}
            height={100}
            className='rounded-full'
          />
          <div className='text-4xl font-bold text-center'>
            <div>{session.user?.name}</div>
          </div>
          <div className='text-xl text-center'>
            <div>Like</div>
            <div>{session.user?.createdAt}</div>
          </div>
          <div className='text-xl text-center'>
            <div>First Login</div>
            <div>{session.user?.createdAt}</div>
          </div>
          <div className='text-xl text-center'>
            <div>Last Login</div>
            <div>{session.user?.lastLogin}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
