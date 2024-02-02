import Link from 'next/link';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className='flex items-center justify-center w-full'>
      <div className='max-w-lg p-8 bg-sub1 rounded-lg shadow-lg mx-4'>
        <div className='flex justify-center mb-2'>
          <Image
            src='/images/profile/pingulee.png'
            alt='Pingu Lee'
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
        <div className='text-4xl font-bold text-center mb-7'>Pingu Lee</div>
        <div>
          <div className='text-lg flex flex-col items-center space-y-2'>
            <Link
              href='https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=escapeweedy@gmail.com'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 min-w-[290px] px-4 py-2 rounded-md gap-2 hover:bg-white hover:text-black transition-colors duration-200 ease-in-out shadow-md bg-red-500 text-white hover:shadow-lg'
            >
              <SiGmail />
              <span>escapeweedy@gmail.com</span>
            </Link>

            <Link
              href='https://github.com/PinguLee'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 min-w-[290px] px-4 py-2 rounded-md gap-2 hover:bg-white hover:text-black transition-colors duration-200 ease-in-out shadow-md bg-black text-white hover:shadow-lg'
            >
              <FaGithub />
              <span>https://github.com/PinguLee</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
