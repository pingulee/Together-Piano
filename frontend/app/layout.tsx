import type { Metadata } from 'next';
import '@/app/styles/globals.scss';
import Sidebar from '@/app/components/sidebar/sidebar.component';
import { Children } from '@/app/interfaces/children.interface';
import AuthContext from '@/app/contexts/AuthContext';
import { TokenProvider } from '@/app/contexts/TokenContext';

export const metadata: Metadata = {
  title: 'Together Piano',
  description: 'Together Piano',
};

export default function RootLayout({ children }: Children) {
  return (
    <TokenProvider>
      <html lang='ko'>
        <body>
          <AuthContext>
            <div className='flex'>
              <Sidebar />
              <main className='flex w-full'>{children}</main>
            </div>
          </AuthContext>
        </body>
      </html>
    </TokenProvider>
  );
}
