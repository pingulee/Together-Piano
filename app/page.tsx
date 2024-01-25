'use client';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [time, setTime] = useState('');

  const fetchTime = async () => {
    const response = await fetch('/api/korea_date_time');
    const data = await response.json();
    setTime(new Date(data.time).toLocaleString('ko-KR'));
  };

  useEffect(() => {
    fetchTime();
    const timer = setInterval(() => {
      fetchTime();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='korea-time-container'>
      <p className='korea-time'>{time}</p>
    </div>
  );
}
