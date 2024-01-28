import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className='flex items-center justify-center w-full'>
      <div className='p-8 rounded-lg shadow-md border-2 mx-4'>
        <h1 className='text-4xl font-bold mb-4 text-center'>Pingu Lee</h1>
        <p className='text-xl mb-4 text-center'>
          저는 [직업 또는 역할]로 일하고 있으며, 주로 [기술 스택]을 사용합니다.
        </p>
        <p className='text-xl mb-4 text-center'>
          자세한 정보를 제공하기 위해 이 페이지를 만들었습니다.
        </p>
        <p className='text-xl mb-4 text-center'>
          더 많은 정보나 연락하고 싶다면 아래의 연락처로 연락주세요.
        </p>
        <div className='text-xl flex flex-col items-center space-y-2'>
          <div className='flex items-center space-x-2'>
            <SiGmail className='text-xl' />
            <span>escapeweedy@gmail.com</span> {/* Gmail 주소로 변경 */}
          </div>
          <div className='flex items-center'>
            <Link
              href='https://github.com/PinguLee'
              target='_blank'
              rel='noopener noreferrer'
              className='flex space-x-2'
            >
              <FaGithub className='text-xl' />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
