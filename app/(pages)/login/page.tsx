'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getProviders, signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaDiscord } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const CALLBACK_URL = '/piano';

/** 제공자별 표시. 등록되지 않은 제공자는 아예 그리지 않습니다. */
const PROVIDER_STYLES: Record<string, { icon: ReactNode; className: string }> =
  {
    google: {
      icon: <FcGoogle className='text-lg' />,
      className: 'bg-white text-black hover:bg-white/85',
    },
    discord: {
      icon: <FaDiscord className='text-lg' />,
      className: 'bg-[#5865f2] text-white hover:bg-[#5865f2]/85',
    },
  };

interface AvailableProvider {
  id: string;
  name: string;
}

export default function LoginPage() {
  const { status } = useSession();
  const [providers, setProviders] = useState<AvailableProvider[] | null>(null);

  /**
   * 실제로 자격 증명이 설정된 제공자만 서버에서 받아 옵니다.
   * 버튼을 고정으로 그려 두면 설정되지 않은 제공자를 눌렀을 때
   * 오류 페이지로 떨어집니다.
   */
  useEffect(() => {
    let cancelled = false;

    void getProviders().then((result) => {
      if (cancelled) return;
      setProviders(
        Object.values(result ?? {}).map((provider) => ({
          id: provider.id,
          name: provider.name,
        })),
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='stage-light flex flex-1 items-center justify-center px-6 py-12'>
      <div className='w-full max-w-sm'>
        <h1 className='text-2xl font-bold tracking-tight'>로그인</h1>
        <p className='text-ink-muted mt-2 text-sm leading-relaxed'>
          로그인하면 연주실과 채팅에 내 이름으로 표시됩니다. 로그인하지 않아도
          연주는 할 수 있습니다.
        </p>

        <div className='mt-8 flex flex-col gap-2.5'>
          {providers === null && (
            <div className='bg-raised h-11 animate-pulse rounded-lg' />
          )}

          {providers?.map((provider) => {
            const style = PROVIDER_STYLES[provider.id];
            return (
              <button
                key={provider.id}
                type='button'
                onClick={() =>
                  signIn(provider.id, { callbackUrl: CALLBACK_URL })
                }
                className={`flex h-11 items-center justify-center gap-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  style?.className ??
                  'border-line text-ink hover:bg-raised border'
                }`}
              >
                {style?.icon}
                {provider.name}(으)로 계속하기
              </button>
            );
          })}

          {providers?.length === 0 && (
            <p className='border-line bg-surface/70 text-ink-faint rounded-lg border p-4 text-xs leading-relaxed'>
              아직 로그인 제공자가 설정되지 않았습니다. 서버 환경변수에 OAuth
              자격 증명을 넣으면 이 자리에 버튼이 나타납니다.
            </p>
          )}
        </div>

        {status === 'authenticated' && (
          <p className='text-ink-faint mt-6 text-xs'>
            이미 로그인되어 있습니다.{' '}
            <Link href='/profile' className='text-accent-hot hover:underline'>
              내 계정 보기
            </Link>
          </p>
        )}

        <Link
          href='/piano'
          className='text-ink-faint hover:text-ink-muted mt-8 inline-block text-xs transition-colors'
        >
          로그인 없이 연주실로 →
        </Link>
      </div>
    </div>
  );
}
