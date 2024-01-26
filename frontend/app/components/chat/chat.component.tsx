import { useEffect, useState, KeyboardEvent } from 'react'; // KeyboardEvent 타입을 추가로 임포트합니다.
import io from 'socket.io-client';
import { IoMdSend } from 'react-icons/io';

const socket = io('http://localhost:3288');

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    socket.on('message', (data: string) => {
      console.log('수신된 메시지:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      socket.emit('message', currentMessage);
      setCurrentMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 동작(줄바꿈)을 방지합니다.
      handleSendMessage();
    }
    // 쉬프트 키와 함께 엔터 키가 눌리면 기본적인 텍스트 에어리어의 동작(줄바꿈)을 수행합니다.
  };

  return (
    <div className='max-w-md flex flex-col bg-sub2 h-screen p-2 w-72 duration-300 relative justify-between rounded'>
      <div className='overflow-y-auto'>
        {messages.map((msg, index) => (
          <div key={index} className='text-sm text-gray-700'>
            {msg}
          </div>
        ))}
      </div>
      <div
        className={`mt-4 flex bg-sub1 border-2 rounded ${
          isFocused ? ' border-highlight' : 'border-sub1'
        }`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
