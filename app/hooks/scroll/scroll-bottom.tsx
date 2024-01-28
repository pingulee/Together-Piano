import { useEffect, useRef } from 'react';

export const useAutoScrollToBottom = (dependency: any[]) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [...dependency]);

  return bottomRef;
};
