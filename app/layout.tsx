import type { Metadata } from 'next';
import '@/app/styles/globals.css';
import SidebarComponent from '@/app/components/sidebar/sidebar.component';
import { SocketProvider } from '@/app/components/socket/socket-provider.component';
import { Children } from '@/app/interfaces/children.interface';

import AuthContext from '@/app/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Together Piano',
  description: 'Together Piano',
};

export default function RootLayout({ children }: Children) {
  return (
    <html lang='ko'>
      <body>
        <AuthContext>
          <SocketProvider>
            <div className='flex'>
              <SidebarComponent />
              <div className='flex justify-center items-center h-screen w-screen'>
                {children}
              </div>
            </div>
          </SocketProvider>
        </AuthContext>
      </body>
    </html>
  );
}
