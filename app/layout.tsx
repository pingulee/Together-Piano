import type { Metadata } from 'next';
import '@/styles/globals.css';
import Sidebar from '@/app/components/Sidebar/SidebarComponent';

export const metadata: Metadata = {
  title: 'Together Piano',
  description: 'Together Piano',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body className='layout'>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
