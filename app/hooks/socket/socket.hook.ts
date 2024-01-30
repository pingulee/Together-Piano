import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useToken } from '@/app/contexts/token.context';
import { Sender } from '@/app/interfaces/message/sender.interface';
import { Content } from '@/app/interfaces/message/content.interface';
import { Country } from '@/app/interfaces/country/country.interface';
import { useUserCountry } from '@/app/hooks/user-country/user-country.hook';

interface MessageProps extends Sender, Content, Country {}

export const useSocket = () => {
  const token = useToken();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userCount, setUserCount] = useState(0);
  const userCountry = useUserCountry();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('192.168.100.83:3288', {
      query: { token },
    });

    socketRef.current.on('message', (data: MessageProps) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketRef.current.on('userCount', (count: number) => {
      setUserCount(count);
    });

    return () => {
      socketRef?.current?.disconnect();
    };
  }, [token]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageData: MessageProps = {
        content: currentMessage,
        sender: token,
        country: userCountry,
      };
      socketRef?.current?.emit('message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage('');
    }
  };

  return {
    messages,
    setMessages,
    currentMessage,
    setCurrentMessage,
    userCount,
    setUserCount,
    handleSendMessage,
  };
};
