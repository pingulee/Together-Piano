'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const onSocket = () => {
    const socket = io('http://localhost:3288');

    setInterval(() => {
      socket.emit('good', '클라이언트 -> 서버');
    }, 1000);

    socket.on('hi', (data) => console.log(data)); // 서버 -> 클라이언트
  };

  return <button onClick={onSocket}>socket 통신 시작</button>;
}
