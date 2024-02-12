import React, { useEffect, useRef, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

import { FaUser } from 'react-icons/fa';
import { BsArrowLeftShort } from 'react-icons/bs';
import { IoMdSend, IoMdClose } from 'react-icons/io';

import { useFocus } from '@/app/hooks/textarea-focus/textarea-focus.hook';
import { useSideOpen } from '@/app/hooks/side-open/side-open.hook';
import { useAutoScrollToBottom } from '@/app/hooks/scroll/scroll-bottom.hook';
import { useUserCountry } from '@/app/hooks/user-country/user-country.hook';

import { Sender } from '@/app/interfaces/message/sender.interface';
import { Content } from '@/app/interfaces/message/content.interface';
import { Country } from '@/app/interfaces/country/country.interface';
import { Type } from '@/app/interfaces/message/type.interface';

import { useKeyDown } from '@/app/utils/enter/enter.util';

import io, { Socket } from 'socket.io-client';

import { useToken } from '@/app/contexts/token.context';

interface MessageProps extends Sender, Content, Country, Type {}

export default function Chat() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? 'Anonymous';
  const token = useToken();
  const userCountry = useUserCountry();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userCount, setUserCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('192.168.0.106:3000', {
      query: { token, name },
    });

    socketRef.current.on('message', (data: MessageProps) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, type: 'user' },
      ]);
    });

    socketRef.current.on('userCount', (count: number) => {
      setUserCount(count);
    });

    socketRef.current.on('system', (data: MessageProps) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, type: 'system' },
      ]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token, name, userCountry]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageData: MessageProps = {
        content: currentMessage,
        sender: name,
        country: userCountry,
        type: 'user',
      };
      socketRef.current?.emit('message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage('');
    }
  };

  const { isFocused, setIsFocused } = useFocus();
  const { open, setOpen } = useSideOpen();
  const messagesEndRef = useAutoScrollToBottom([messages]);
  const flagImagePath = `/images/flags/${userCountry?.toLowerCase()}.png`;

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`flex min-h-screen max-h-screen flex-col min-w-20 duration-300 max-w-72 bg-sub2 h-screen p-2 relative justify-between z-50 ${
        open ? 'w-20' : 'w-72'
      }`}
    >
      <BsArrowLeftShort
        className={`bg-white text-black text-3xl rounded-full absolute -left-3 top-9 border-2 border-sub1 hover:bg-highlight hover:text-white duration-300 cursor-pointer ${
          !open && 'rotate-180'
        }`}
        onClick={() => setOpen(!open)}
      />

      <div className='mb-4 flex bg-sub1 border-2 rounded border-sub1 justify-center items-center cursor-pointer hover:bg-white hover:text-black duration-300'>
        <FaUser />
        <span>{userCount}</span>
      </div>

      {!open && (
        <>
          <div className='flex-grow overflow-y-scroll'>
            {messages.map((msg, index) => (
              <div key={index} className='p-2'>
                <div
                  className={`flex text-x font-bold mb-1 gap-2 items-center ${
                    msg.type === 'system' ? '' : 'justify-start'
                  }`}
                >
                  {msg.type !== 'system' && (
                    <Image
                      src={flagImagePath}
                      alt={msg.country}
                      width={30}
                      height={20}
                    />
                  )}
                  {msg.sender}
                </div>
                <div
                  className={`bg-${
                    msg.type === 'system' ? 'white' : 'sub1'
                  } rounded w-full break-words p-1 ${
                    msg.type === 'system' ? 'text-black' : ''
                  }`}
                >
                  {msg.content}
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
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className='bg-sub1 text-xl rounded-lg p-2 w-full resize-none outline-none'
              placeholder='Type message...'
              rows={2}
            />
            <div
              onClick={handleSendMessage}
              className='ml-2 bg-sub1 hover:text-highlight font-bold p-2 rounded flex items-center justify-center duration-300 cursor-pointer'
            >
              <IoMdSend size='20px' />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
