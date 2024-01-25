'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3288');

export default function Home() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server');
    });

    socket.on('message', (data) => {
      console.log('Message from server:', data);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.disconnect();
    };
  }, []);
}
