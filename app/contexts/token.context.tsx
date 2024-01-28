'use client';
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { issueToken, getUserToken } from '@/app/utils/token/token.util';

// TokenContext의 타입 정의
type TokenContextType = string;

// Context 생성 시 초기값을 undefined로 설정하고, 타입을 TokenContextType | undefined로 지정
const TokenContext = createContext<TokenContextType | undefined>(undefined);

// TokenProvider의 props 타입을 정의
interface TokenProviderProps {
  children: ReactNode;
}

export function TokenProvider({ children }: TokenProviderProps) {
  const [token, setToken] = useState<TokenContextType>('');

  useEffect(() => {
    let currentToken = getUserToken();
    if (!currentToken) {
      currentToken = issueToken();
    }
    setToken(currentToken);
  }, []);

  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}

// useToken 훅을 사용할 때 TokenContextType을 반환하도록 구현
export function useToken(): TokenContextType {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}
