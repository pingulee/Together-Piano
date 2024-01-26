'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3288');

export default function Home() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    // 서버로부터 메시지를 받을 때의 이벤트 리스너
    socket.on('message', (newMessage: string) => {
      setReceivedMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      // 메시지 전송
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='메시지를 입력하세요'
      />
      <button onClick={sendMessage}>전송</button>
      <div>
        <h3>받은 메시지:</h3>
        {receivedMessages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
