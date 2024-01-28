import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className='flex items-center justify-center w-full'>
      <div className='max-w-lg p-8 bg-sub1 rounded-lg shadow-lg mx-4'>
        <div className='flex justify-center'>
          <Image
            src='/images/profile/pingulee.png'
            alt='Pingu Lee'
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
        <p className='text-4xl font-bold mb-4 text-center'>Pingu Lee</p>
        <p className='text-xl mb-4 text-center'>
          I am a developer who plays the piano as a hobby.
        </p>
        <p className='text-xl mb-4 text-center'>
          I made this page to play the piano with people from all over the
          world.
        </p>
        <p className='text-xl mb-4 text-center'>
          If you want to know more or contact us, please contact us at the
          contact information below.
        </p>
        <div className='text-xl flex flex-col items-center space-y-2'>
          <Link
            href='https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=escapeweedy@gmail.com'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center space-x-2 border-2 min-w-[300px] p-2 rounded'
          >
            <SiGmail className='text-red-500' />
            <span>escapeweedy@gmail.com</span>
          </Link>

          <Link
            href='https://github.com/PinguLee'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center space-x-2 border-2 min-w-[300px] p-2 rounded'
          >
            <FaGithub className='text-xl' />
            <span>https://github.com/PinguLee</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
