import type { Metadata } from 'next';
import '@/app/styles/globals.css';
import SidebarComponent from '@/app/components/Sidebar/sidebar.component';
import { ChildrenProp } from '@/app/interfaces/children.interface';

import AuthContext from '@/app/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Together Piano',
  description: 'Together Piano',
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
