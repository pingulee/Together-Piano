import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Sidebar from '@/app/components/sidebar';
import AuthProvider from '@/app/providers/session-provider';
import '@/app/styles/globals.css';

export const metadata: Metadata = {
  title: 'Together Piano',
  description: '브라우저에서 여러 사람이 함께 피아노를 연주하는 공간',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <AuthProvider>
          <div className='flex h-screen w-screen'>
            <Sidebar />
            <main className='flex h-screen max-h-screen w-full'>
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
