import { useEffect, useState, KeyboardEvent, useRef } from 'react'; // KeyboardEvent 타입을 추가로 임포트합니다.
import io from 'socket.io-client';
import { IoMdSend } from 'react-icons/io';
import { Sender } from '@/app/interfaces/message/sender.interface';
import { Text } from '@/app/interfaces/message/text.interface';
import { FaUser } from 'react-icons/fa';
import React from 'react';
import { useToken } from '@/app/contexts/TokenContext';
import { BsArrowLeftShort } from 'react-icons/bs';

interface MessageProps extends Sender, Text {}

const socket = io('http://192.168.30.158:3288');

export default function Chat() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userCount, setUserCount] = useState(0); // 현재 접속 중인 사용자 수 상태
  const [open, setOpen] = useState(false);
  const token = useToken();

  // 메시지 전송
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageData: MessageProps = {
        text: currentMessage,
        sender: token, // 현재 사용자의 토큰(닉네임)을 sender 필드에 설정
      };
      socket.emit('message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage('');
    }
  };

  // 메시지 수신
  useEffect(() => {
    socket.on('message', (data: MessageProps) => {
      console.log('수신된 메시지:', data);
      if (data.sender !== 'token') {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    socket.on('userCount', (count: number) => {
      setUserCount(count); // 서버로부터 받은 현재 사용자 수를 상태에 저장
    });
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 동작(줄바꿈)을 방지합니다.
      handleSendMessage();
    }
    // 쉬프트 키와 함께 엔터 키가 눌리면 기본적인 텍스트 에어리어의 동작(줄바꿈)을 수행합니다.
  };

  useEffect(() => {
    // 메시지 목록이 업데이트될 때마다 스크롤을 아래로 이동
    messagesEndRef.current?.scrollIntoView({});
  }, [messages]);

  return (
    <div
      className={`flex flex-col min-w-0 max-w-72 bg-sub2 h-screen p-2 duration-300 relative justify-between ${
        open ? 'w-20' : 'w-72'
      }`}
    >
      <BsArrowLeftShort
        className={`bg-white text-black text-3xl rounded-full absolute -left-3 top-9 border-2 border-sub ${
          open && 'rotate-180'
        }`}
        onClick={() => setOpen(!open)}
      />
      <div className='mb-4 flex bg-sub1 border-2 rounded border-sub1 justify-center items-center'>
        <FaUser />
        <span>{userCount}</span>
      </div>
      <div className='flex-grow overflow-y-scroll'>
        {messages.map((msg, index) => (
          <div key={index} className='p-2'>
            <div className='text-x font-bold mb-1'>{msg.sender}</div>
            <div className='bg-sub1 text-x rounded w-full break-words p-1'>
              {msg.text.split('\n').map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div
        className={`mt-4 flex bg-sub1 border-2 rounded ${
          isFocused ? 'border-highlight' : 'border-sub1'
        }`}
      >
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className='bg-sub1 text-xl rounded-lg p-2 w-full resize-none outline-none'
          placeholder='Type message...'
          rows={2}
        />
        <div
          onClick={handleSendMessage}
          className='ml-2 bg-sub1 text-highlight hover:text-white font-bold p-2 rounded flex items-center justify-center'
        >
          <IoMdSend size='20px' />
        </div>
      </div>
    </div>
  );
}
