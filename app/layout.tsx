import type { Metadata } from 'next';
import '@/app/styles/globals.css';
import SidebarComponent from '@/app/components/Sidebar/SidebarComponent';
import { ChildrenProp } from '@/app/types/ChildrenProp';

import AuthContext from '@/app/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Together Piano',
  description: 'Together Piano',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: ChildrenProp) {
  return (
    <html lang='ko'>
      <body>
        <AuthContext>
          <div className='flex'>
            <SidebarComponent />
            <div className='flex justify-center items-center h-screen w-screen'>
              {children}
            </div>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
