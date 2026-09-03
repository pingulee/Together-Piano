import type { Metadata } from 'next';

import Chat from '@/app/components/chat';
import PianoStage from '@/app/components/piano-stage';
import SocketConnection from '@/app/providers/socket-connection';

export const metadata: Metadata = {
  title: '연주실',
};

export default function PianoPage() {
  return (
    <SocketConnection>
      <PianoStage />
      <Chat />
    </SocketConnection>
  );
}
