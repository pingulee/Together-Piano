'use client';

import Chat from '@/app/components/chat/chat.component';
import PianoContainer from '@/app/components/piano/piano-container.component';
import { getUserIp } from '@/app/hooks/ip/ip.hook';

export default function PianoPage() {
  const userIp = getUserIp();
  console.log(getUserIp());
  return (
    <>
      <div className='flex flex-grow-7 w-full piano-cursor items-center justify-center'>
        <PianoContainer />
      </div>
      <>
        <Chat />
      </>
    </>
  );
}
