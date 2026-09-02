import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

const GMAIL_ADDRESS = 'escapeweedy@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${GMAIL_ADDRESS}`;
const GITHUB_URL = 'https://github.com/PinguLee';

export default function ContactPage() {
  return (
    <div className='flex w-full items-center justify-center select-none'>
      <div className='bg-sub1 mx-4 max-w-lg rounded-lg p-8 shadow-lg'>
        <div className='mb-2 flex justify-center'>
          <Image
            src='/images/profile/pingulee.png'
            alt='Pingu Lee'
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
        <div className='mb-7 text-center text-4xl font-bold'>Pingu Lee</div>

        <div className='flex flex-col items-center gap-2 text-lg'>
          <Link
            href={GMAIL_COMPOSE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='flex min-w-[290px] items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white duration-200 hover:bg-red-500/80'
          >
            <SiGmail />
            <span>{GMAIL_ADDRESS}</span>
          </Link>

          <Link
            href={GITHUB_URL}
            target='_blank'
            rel='noopener noreferrer'
            className='flex min-w-[290px] items-center gap-2 rounded-md bg-[#0d1117] px-4 py-2 text-white duration-200 hover:bg-[#0d1117]/80'
          >
            <FaGithub />
            <span>{GITHUB_URL}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
