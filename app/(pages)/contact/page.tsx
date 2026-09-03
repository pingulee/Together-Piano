import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export const metadata: Metadata = {
  title: '만든 사람',
};

const GMAIL_ADDRESS = 'escapeweedy@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${GMAIL_ADDRESS}`;
const GITHUB_URL = 'https://github.com/PinguLee';

const LINKS = [
  {
    href: GMAIL_COMPOSE_URL,
    label: GMAIL_ADDRESS,
    caption: '메일',
    icon: <SiGmail />,
  },
  {
    href: GITHUB_URL,
    label: 'github.com/PinguLee',
    caption: 'GitHub',
    icon: <FaGithub />,
  },
];

export default function ContactPage() {
  return (
    <div className='stage-light flex flex-1 items-center justify-center px-6 py-12'>
      <div className='w-full max-w-sm'>
        <div className='flex items-center gap-4'>
          <Image
            src='/images/profile/pingulee.png'
            alt=''
            width={64}
            height={64}
            className='border-line size-16 shrink-0 rounded-full border object-cover'
          />
          <div>
            <h1 className='text-xl font-bold tracking-tight'>Pingu Lee</h1>
            <p className='text-ink-faint text-sm'>
              Together Piano 를 만들었습니다
            </p>
          </div>
        </div>

        <ul className='mt-8 flex flex-col gap-2'>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='border-line bg-surface/70 hover:border-line-strong flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors'
              >
                <span className='bg-raised text-ink-muted grid size-9 shrink-0 place-items-center rounded-lg text-base'>
                  {link.icon}
                </span>
                <span className='min-w-0'>
                  <span className='text-ink-faint block text-xs'>
                    {link.caption}
                  </span>
                  <span className='block truncate text-sm font-medium'>
                    {link.label}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
