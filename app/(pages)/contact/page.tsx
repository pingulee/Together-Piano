import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { HiArrowUpRight } from 'react-icons/hi2';
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
      <div className='flex w-full max-w-xs flex-col gap-7'>
        <header className='flex items-center gap-3'>
          <Image
            src='/images/profile/pingulee.png'
            alt=''
            width={44}
            height={44}
            className='border-line size-11 shrink-0 rounded-full border object-cover'
          />
          <div>
            <h1 className='text-base font-semibold'>Pingu Lee</h1>
            <p className='text-ink-faint text-xs'>
              Together Piano 를 만들었습니다
            </p>
          </div>
        </header>

        <ul className='flex flex-col gap-1.5'>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className='border-line bg-surface hover:border-line-strong hover:bg-raised group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors'
              >
                <span className='bg-raised text-ink-muted grid size-8 shrink-0 place-items-center rounded-md text-sm'>
                  {link.icon}
                </span>
                <span className='min-w-0 flex-1'>
                  <span className='text-ink-faint text-2xs block'>
                    {link.caption}
                  </span>
                  <span className='block truncate text-sm font-medium'>
                    {link.label}
                  </span>
                </span>
                <HiArrowUpRight className='text-ink-faint group-hover:text-ink shrink-0 text-xs transition-colors' />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
