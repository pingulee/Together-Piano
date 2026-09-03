'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { RiLogoutBoxRLine } from 'react-icons/ri';

import IdentityPanel from '@/app/components/identity-panel';
import { Button, ButtonLink } from '@/app/components/ui/button';
import { Panel, SectionHeading } from '@/app/components/ui/panel';

const FALLBACK_IMAGE = '/images/logo.webp';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  return (
    <div className='stage-light flex-1 overflow-y-auto'>
      <div className='mx-auto flex w-full max-w-sm flex-col gap-6 px-6 py-12'>
        {/*
          연주실 표시 이름은 로그인과 무관하므로 계정 상태와 별개로 항상 보입니다.
          예전에는 로그인하지 않으면 이 페이지에 로그인 안내만 떠서, 닉네임을
          바꿀 수 있다는 사실이 어디에도 보이지 않았습니다.
        */}
        <Panel padding='lg' className='flex flex-col gap-4'>
          <SectionHeading
            title='연주실 프로필'
            description='로그인 여부와 무관하게 이 브라우저에 저장됩니다.'
            level='h2'
          />
          <IdentityPanel />
        </Panel>

        <Panel padding='lg' className='flex flex-col gap-4'>
          <SectionHeading title='계정' level='h2' />

          {status === 'loading' && (
            <div className='bg-raised h-14 animate-pulse rounded-md' />
          )}

          {status !== 'loading' && !session && (
            <>
              <p className='text-ink-faint text-xs'>
                로그인하면 계정 이름이 닉네임 기본값으로 채워집니다.
              </p>
              <ButtonLink href='/login' variant='primary' size='sm' block>
                로그인
              </ButtonLink>
            </>
          )}

          {session && <AccountDetails session={session} />}
        </Panel>

        <ButtonLink href='/piano' variant='secondary' block>
          연주실로
        </ButtonLink>
      </div>
    </div>
  );
}

type Session = NonNullable<ReturnType<typeof useSession>['data']>;

function AccountDetails({ session }: { session: Session }) {
  const { name, email, image, id } = session.user;

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-3'>
        <Image
          src={image ?? FALLBACK_IMAGE}
          alt=''
          width={44}
          height={44}
          className='border-line size-11 shrink-0 rounded-full border object-cover'
        />
        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold'>
            {name ?? '이름 없음'}
          </p>
          {email && <p className='text-ink-faint truncate text-xs'>{email}</p>}
        </div>
      </div>

      <dl className='divide-line border-line divide-y overflow-hidden rounded-md border text-xs'>
        <div className='flex items-center justify-between gap-3 px-3 py-2'>
          <dt className='text-ink-faint'>계정 ID</dt>
          <dd className='text-ink-muted truncate font-mono'>{id}</dd>
        </div>
      </dl>

      <Button
        variant='ghost'
        size='sm'
        onClick={() => signOut({ callbackUrl: '/' })}
        className='self-start'
      >
        <RiLogoutBoxRLine />
        로그아웃
      </Button>
    </div>
  );
}
