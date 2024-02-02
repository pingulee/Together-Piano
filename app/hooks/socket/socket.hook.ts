import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { User } from '@/server/models/user.model'; // User 모델 import 추가

import { useToken } from '@/app/contexts/token.context';
import { Sender } from '@/app/interfaces/message/sender.interface';
import { Content } from '@/app/interfaces/message/content.interface';
import { Country } from '@/app/interfaces/country/country.interface';
import { useUserCountry } from '@/app/hooks/user-country/user-country.hook';
import { Type } from '@/app/interfaces/message/type.interface';

interface MessageProps extends Sender, Content, Country, Type {}

export const useSocket = () => {
  const token = useToken();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [systemMessages, setSystemMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [userCount, setUserCount] = useState(0);
  const userCountry = useUserCountry();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('192.168.100.83:3000', {
      query: { token },
    });

    // socketRef.current.on('connection', async () => {
    //   try {
    //     const newUser = new User({
    //       nickname token,
    //     });
    //     await newUser.save();
    //     console.log('New user saved to database');
    //   } catch (error) {
    //     console.error('Error saving new user to database:', error);
    //   }
    // });

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
      socketRef?.current?.disconnect();
    };
  }, [token]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageData: MessageProps = {
        content: currentMessage,
        sender: token,
        country: userCountry,
        type: 'user',
      };
      socketRef?.current?.emit('message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage('');
    }
  };

  return {
    messages,
    setMessages,
    systemMessages,
    setSystemMessages,
    currentMessage,
    setCurrentMessage,
    userCount,
    setUserCount,
    handleSendMessage,
  };
};
