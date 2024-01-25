'use client';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch('/api/datetime');
        const data = await response.json();
        setDateTime(data.datetime);
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    fetchDateTime();
  }, []);

  return (
    <div>
      <p>서버의 현재 날짜와 시간: {dateTime ? dateTime : '로딩 중...'}</p>
    </div>
  );
}
