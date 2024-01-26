'use client';
import React, { useEffect, useState } from 'react';
import getDateTime from '@/app/utils/datetime/datetime.util'; // datetime 함수 제거

export default function Home() {
  const [dateTime, setDateTime] = useState<string>();

  useEffect(() => {
    // 컴포넌트 마운트 시 현재 시간 설정 및 1초마다 시간 업데이트
    const updateDateTime = () => {
      const newDateTime = getDateTime(); // 현재 UTC 시간을 가져옴
      setDateTime(newDateTime); // dateTime 상태 업데이트
    };

    updateDateTime(); // 컴포넌트 마운트 시 즉시 실행

    const intervalId = setInterval(updateDateTime, 1000); // 1초마다 업데이트

    // 컴포넌트 언마운트 시 인터벌 정리
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
