'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className='flex items-center justify-center w-full select-none'>
        <div className='flex flex-col p-8 bg-sub1 rounded-lg shadow-lg mx-4 items-center justify-center '>
          <Link
            href='/login'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center space-x-2 min-w-[290px] px-4 py-2 rounded-md gap-2 duration-200 bg-white text-black hover:bg-opacity-80 text-xl justify-center'
          >
            Please Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center w-full select-none'>
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
          {/* <div className='text-xl text-center'>
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
          </div> */}

          <div
            className='mt-4 px-4 py-2 text-black text-lg rounded bg-white hover:bg-opacity-80 duration-200 text-center cursor-pointer'
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            {' '}
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}
