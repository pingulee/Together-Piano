'use client';
import React, { useEffect, useState } from 'react';
import getDateTime from '@/app/utils/datetime/datetime.util';

export default function HomePage() {
  const [dateTime, setDateTime] = useState<string>();

  useEffect(() => {
    const updateDateTime = () => {
      const newDateTime = getDateTime();
      setDateTime(newDateTime);
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 0);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <span className='text-4xl '>Current time in Korea</span>
      <span className='text-6xl bg-sub1 p-5 rounded-full'>
        {dateTime ? dateTime : 'loading...'}
      </span>
      {/* 현재 접속 중인 사용자 시간 날짜도 표시할 예정 */}
    </div>
  );
}
