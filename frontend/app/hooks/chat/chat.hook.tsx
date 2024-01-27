import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useToken } from '@/app/contexts/TokenContext';
import { Sender } from '@/app/interfaces/message/sender.interface';
import { Content } from '@/app/interfaces/message/content.interface';

interface MessageProps extends Sender, Content {}

export const useChat = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userCount, setUserCount] = useState(0);
  const [open, setOpen] = useState(false);
  const token = useToken();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io('http://192.168.0.106:3288', {
      query: { token },
    });

    socketRef.current.on('message', (data: MessageProps) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketRef.current.on('userCount', (count: number) => {
      setUserCount(count);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const messageData: MessageProps = {
        content: currentMessage,
        sender: token,
      };
      socketRef.current.emit('message', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setCurrentMessage('');
    }
  };

  return {
    messages,
    setMessages,
    currentMessage,
    setCurrentMessage,
    isFocused,
    setIsFocused,
    messagesEndRef,
    userCount,
    setUserCount,
    open,
    setOpen,
    handleSendMessage,
  };
};
