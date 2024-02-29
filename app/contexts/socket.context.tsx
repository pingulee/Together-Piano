import React, { ReactNode, createContext } from 'react';
import io, { Socket } from 'socket.io-client';

export const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode; // ReactNode 유형을 사용하여 모든 자식 요소를 허용합니다.
}
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket: Socket = io('15.165.141.119');

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
