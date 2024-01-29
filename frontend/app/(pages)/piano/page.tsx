'use client';

import Chat from '@/app/components/chat/chat.component';

import PianoContainer from '@/app/components/piano/piano-container.component';
import { getUserIp } from '@/app/hooks/ip/ip.hook';

export default function PianoPage() {
  return (
    <div className='flex flex-grow-7 w-full items-center justify-center'>
      <PianoContainer />
      <Chat />
    </div>
  );
}
