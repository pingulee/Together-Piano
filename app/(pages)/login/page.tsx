'use client';

import Link from 'next/link';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { useEffect, useState, type ReactNode } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button, ButtonLink } from '@/app/components/ui/button';
import { Panel } from '@/app/components/ui/panel';

const CALLBACK_URL = '/piano';

/**
 * 제공자별 표시.
 *
 * 제공자 색은 그들의 브랜드이므로 여기서만 예외적으로 채도를 씁니다.
 * (구글·디스코드 버튼을 무채색으로 그리면 무엇인지 알아보기 어렵습니다)
 */
const PROVIDER_STYLES: Record<string, { icon: ReactNode; className: string }> =
  {
    google: {
      icon: <FcGoogle className='text-lg' />,
      className: 'bg-white text-black hover:bg-white/85 border-transparent',
    },
    discord: {
      icon: <FaDiscord className='text-lg' />,
      className:
        'bg-[#5865f2] text-white hover:bg-[#5865f2]/85 border-transparent',
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
      <div className='flex w-full max-w-xs flex-col gap-7'>
        <header className='flex flex-col gap-2'>
          <h1 className='text-xl font-bold'>로그인</h1>
          <p className='text-ink-muted text-sm'>
            로그인은 선택입니다. 닉네임과 색은 로그인 없이도 정할 수 있고,
            로그인하면 계정 이름이 기본값으로 채워집니다.
          </p>
        </header>

        <div className='flex flex-col gap-2'>
          {providers === null && (
            <div className='bg-raised h-10 animate-pulse rounded-md' />
          )}

          {providers?.map((provider) => (
            <Button
              key={provider.id}
              block
              onClick={() => signIn(provider.id, { callbackUrl: CALLBACK_URL })}
              className={PROVIDER_STYLES[provider.id]?.className}
            >
              {PROVIDER_STYLES[provider.id]?.icon}
              {provider.name}(으)로 계속하기
            </Button>
          ))}

          {providers?.length === 0 && (
            <Panel padding='md'>
              <p className='text-ink-faint text-xs'>
                아직 로그인 제공자가 설정되지 않았습니다. 서버 환경변수에 OAuth
                자격 증명을 넣으면 이 자리에 버튼이 나타납니다.
              </p>
            </Panel>
          )}
        </div>

        {status === 'authenticated' && (
          <p className='text-ink-faint text-xs'>
            이미 로그인되어 있습니다.{' '}
            <Link href='/profile' className='text-ink hover:underline'>
              내 계정 보기
            </Link>
          </p>
        )}

        <ButtonLink href='/piano' variant='ghost' size='sm' className='-ml-3'>
          로그인 없이 연주실로 →
        </ButtonLink>
      </div>
    </div>
  );
}
