'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3288');

export default function Home() {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const fetchDateTime = async () => {
      try {
        const response = await fetch('/api/datetime');
        const data = await response.json();
        setDateTime(data.datetime);
      } catch (error) {
        console.error('API Error:', error);
      }
    };

    fetchDateTime();
  }, []);

  return (
    <div className='flex items-center justify-center w-full'>
      <p>{dateTime ? dateTime : 'loading...'}</p>
    </div>
  );
}
