import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import Sidebar from '@/app/components/sidebar';
import AuthProvider from '@/app/providers/session-provider';
import '@/app/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Together Piano',
    template: '%s · Together Piano',
  },
  description: '여러 사람이 각자의 브라우저에서 같은 피아노를 함께 연주합니다.',
};

export const viewport: Viewport = {
  themeColor: '#0b0b0e',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body className='overflow-hidden'>
        <AuthProvider>
          <div className='flex h-screen w-screen'>
            <Sidebar />
            <main className='flex min-w-0 flex-1'>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
