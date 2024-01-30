import { KeyboardEvent } from 'react';

interface IHandleSendMessage {
  (): void;
}
export const useKeyDown = (handleSendMessage: IHandleSendMessage) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return handleKeyDown;
}
