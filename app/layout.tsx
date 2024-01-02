import type { Metadata } from 'next';
import './globals.css';
import BaseLayout from './components/BaseLayout';

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
    <html lang='en'>
      <body className=''>{children}</body>
    </html>
  );
}
