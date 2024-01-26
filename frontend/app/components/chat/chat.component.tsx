import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { IoMdSend } from 'react-icons/io';

const socket = io('http://localhost:3288');

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false); // textarea의 포커스 상태 추적을 위한 상태

  useEffect(() => {
    socket.on('message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      socket.emit('message', currentMessage);
      setCurrentMessage('');
    }
  };

  return (
    <div className='max-w-md flex flex-col bg-sub2 h-screen p-2 w-72 duration-300 relative justify-between rounded'>
      <ul className='overflow-y-auto'>
        {messages.map((msg, index) => (
          <li key={index} className='text-sm text-gray-700'>
            {msg}
          </li>
        ))}
      </ul>
      <div
        className={`mt-4 flex bg-sub1 border-2 rounded ${
          isFocused ? ' border-highlight' : 'border-sub1'
        }`} // 조건부 스타일 적용
        onFocus={() => setIsFocused(true)} // 포커스 시
        onBlur={() => setIsFocused(false)} // 포커스 해제 시
      >
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className='bg-sub1 rounded-lg p-2 w-full resize-none outline-none'
          placeholder='Type message...'
          rows={2}
        ></textarea>
        <div
          onClick={handleSendMessage}
          className='ml-2 bg-sub1 text-highlight hover:text-white font-bold py-2 px-4 rounded flex items-center justify-center'
        >
          <IoMdSend size='20px' />
        </div>
      </div>
    </div>
  );
}
