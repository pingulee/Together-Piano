'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const FALLBACK_IMAGE = '/images/logo.webp';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className='stage-light flex flex-1 items-center justify-center'>
        <div className='bg-surface h-40 w-full max-w-sm animate-pulse rounded-xl' />
      </div>
    );
  }

  if (!session) {
    return (
      <div className='stage-light flex flex-1 items-center justify-center px-6'>
        <div className='w-full max-w-sm text-center'>
          <h1 className='text-2xl font-bold tracking-tight'>
            로그인이 필요합니다
          </h1>
          <p className='text-ink-muted mt-2 text-sm'>
            로그인하면 연주실에 내 이름으로 표시됩니다.
          </p>
          <Link
            href='/login'
            className='bg-accent hover:bg-accent-hot mt-6 inline-flex h-11 items-center rounded-lg px-6 text-sm font-semibold text-white transition-colors'
          >
            로그인
          </Link>
        </div>
      </div>
    );
  }

  const { name, email, image } = session.user;

  return (
    <div className='stage-light flex flex-1 items-center justify-center px-6 py-12'>
      <div className='w-full max-w-sm'>
        <div className='flex items-center gap-4'>
          <Image
            src={image ?? FALLBACK_IMAGE}
            alt=''
            width={64}
            height={64}
            className='border-line size-16 shrink-0 rounded-full border object-cover'
          />
          <div className='min-w-0'>
            <h1 className='truncate text-xl font-bold tracking-tight'>
              {name ?? '이름 없음'}
            </h1>
            {email && (
              <p className='text-ink-faint truncate text-sm'>{email}</p>
            )}
          </div>
        </div>

        <dl className='divide-line border-line bg-surface/70 mt-8 divide-y overflow-hidden rounded-xl border text-sm'>
          <div className='flex items-center justify-between px-4 py-3'>
            <dt className='text-ink-faint'>연주실 표시 이름</dt>
            <dd className='font-medium'>{name ?? 'Anonymous'}</dd>
          </div>
          <div className='flex items-center justify-between px-4 py-3'>
            <dt className='text-ink-faint'>계정 ID</dt>
            <dd className='text-ink-muted font-mono text-xs'>
              {session.user.id}
            </dd>
          </div>
        </dl>

        <div className='mt-6 flex items-center gap-3'>
          <Link
            href='/piano'
            className='bg-accent hover:bg-accent-hot inline-flex h-11 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-white transition-colors'
          >
            연주실로
          </Link>
          <button
            type='button'
            onClick={() => signOut({ callbackUrl: '/' })}
            className='border-line text-ink-muted hover:border-line-strong hover:text-ink inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors'
          >
            <RiLogoutBoxRLine />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
