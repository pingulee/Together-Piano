'use client';

import { useCurrentTime } from '@/app/hooks/use-current-time';

export default function HomePage() {
  const time = useCurrentTime();

  return (
    <div className='flex h-screen max-h-screen w-full flex-col items-center justify-center space-y-5 select-none'>
      <span className='text-4xl'>Current time in Korea</span>
      <span className='bg-sub1 rounded-full p-5 text-6xl'>
        {time ?? 'loading...'}
      </span>
    </div>
  );
}
