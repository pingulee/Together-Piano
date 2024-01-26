import { useEffect, useState, KeyboardEvent } from 'react'; // KeyboardEvent 타입을 추가로 임포트합니다.
import io from 'socket.io-client';
import { IoMdSend } from 'react-icons/io';
import { Sender } from '@/app/interfaces/message/sender.interface';
import { Text } from '@/app/interfaces/message/text.interface';

interface MessageProps extends Sender, Text {}

const socket = io('http://localhost:3288');

export default function Chat() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // 메시지 전송
  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageData: MessageProps = {
        text: currentMessage,
        sender: 'me',
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, sender: 'them' },
      ]);
    });
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 동작(줄바꿈)을 방지합니다.
      handleSendMessage();
    }
    // 쉬프트 키와 함께 엔터 키가 눌리면 기본적인 텍스트 에어리어의 동작(줄바꿈)을 수행합니다.
  };

  return (
    <div className='max-w-md flex flex-col bg-sub2 h-screen p-2 w-72 duration-300 relative justify-between rounded'>
      <div className='overflow-y-auto w-full flex flex-col gap-2'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-3/4 ${
              msg.sender === 'me'
                ? 'bg-blue-500 ml-auto'
                : 'bg-gray-300 mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div
        className={`mt-4 flex bg-sub1 border-2 rounded ${
          isFocused ? 'border-highlight' : 'border-sub1'
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
