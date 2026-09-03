import Link from 'next/link';
import type { ReactNode } from 'react';
import { BiSolidPiano } from 'react-icons/bi';
import { BsCursorFill } from 'react-icons/bs';
import { FaDoorOpen } from 'react-icons/fa6';
import { MdKeyboardAlt, MdPiano } from 'react-icons/md';

import KoreaClock from '@/app/components/korea-clock';

interface Feature {
  title: string;
  body: string;
  icon: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: '같이 치면 같이 들립니다',
    body: '누른 음이 곧바로 다른 사람에게 전달됩니다. 건반 위에 연주자 색 띠가 올라가 누가 어디를 눌렀는지 한눈에 보입니다.',
    icon: <MdPiano />,
  },
  {
    title: '방을 만들어 초대',
    body: '이름을 적으면 그 자리에서 방이 열리고 만든 사람이 방장이 됩니다. 링크만 보내면 되고, 방장은 방을 잠그거나 내보낼 수 있습니다.',
    icon: <FaDoorOpen />,
  },
  {
    title: '커서까지 공유',
    body: '서로의 마우스 위치가 무대 위에 그대로 보입니다. 닉네임과 색은 로그인 없이도 직접 고를 수 있습니다.',
    icon: <BsCursorFill />,
  },
  {
    title: '키보드와 MIDI 둘 다',
    body: '컴퓨터 자판으로 바로 연주하고, MIDI 건반을 꽂으면 세기와 서스테인 페달까지 그대로 전달됩니다.',
    icon: <MdKeyboardAlt />,
  },
];

export default function HomePage() {
  return (
    <div className='stage-light flex-1 overflow-y-auto'>
      <div className='mx-auto flex min-h-full max-w-4xl flex-col justify-center gap-14 px-6 py-16'>
        <section className='flex flex-col gap-6'>
          <span className='border-line bg-surface/60 text-ink-muted inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs'>
            <span
              className='bg-accent size-1.5 rounded-full'
              aria-hidden='true'
            />
            실시간 합주 · 88건반
          </span>

          <h1 className='text-5xl leading-[1.1] font-bold tracking-tight sm:text-6xl'>
            떨어져 있어도
            <br />
            <span className='text-accent'>같은 피아노</span>를 칩니다
          </h1>

          <p className='text-ink-muted max-w-xl text-base leading-relaxed'>
            브라우저만 있으면 됩니다. 설치할 것도, 준비할 것도 없습니다.
            연주실에 들어가 아무 건반이나 눌러 보세요.
          </p>

          <div className='flex flex-wrap items-center gap-3'>
            <Link
              href='/piano'
              className='bg-accent hover:bg-accent-hot inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors'
            >
              <BiSolidPiano className='text-lg' />
              연주실 입장
            </Link>
            <Link
              href='/login'
              className='border-line text-ink-muted hover:border-line-strong hover:text-ink inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors'
            >
              로그인 (선택)
            </Link>
          </div>
        </section>

        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className='border-line bg-surface/70 hover:border-line-strong flex flex-col gap-3 rounded-xl border p-5 transition-colors'
            >
              <span className='bg-accent/12 text-accent-hot grid size-9 place-items-center rounded-lg text-lg'>
                {feature.icon}
              </span>
              <h2 className='text-sm font-semibold'>{feature.title}</h2>
              <p className='text-ink-faint text-xs leading-relaxed'>
                {feature.body}
              </p>
            </article>
          ))}
        </section>

        <footer className='border-line flex flex-wrap items-center justify-between gap-4 border-t pt-6'>
          <KoreaClock />
          <p className='text-ink-faint text-xs'>
            같은 지역에서는 왕복 10~30ms 로 합이 맞습니다
          </p>
        </footer>
      </div>
    </div>
  );
}
