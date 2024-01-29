'use client';
import React, { useEffect, useState } from 'react';
import { useDateTime } from '@/app/hooks/datetime/datetime.hook';

export default function HomePage() {
  const dateTime = useDateTime();

  return (
    <div className='flex flex-col min-h-screen max-h-screen w-full items-center justify-center space-y-5'>
      <span className='text-4xl'>Current time in Korea</span>
      <span className='text-6xl bg-sub1 p-5 rounded-full'>
        {dateTime ? dateTime : 'loading...'}
      </span>

      {/* 현재 접속 중인 사용자 시간 날짜도 표시할 예정 */}
    </div>
  );
}
