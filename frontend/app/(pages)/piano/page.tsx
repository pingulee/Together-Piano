'use client';

import Chat from '@/app/components/chat/chat.component';
import PianoContainer from '@/app/components/piano/piano-container.component';

export default function PianoPage() {
  return (
    <>
      <div className='flex flex-grow-7 w-full piano-cursor items-center'>
        <PianoContainer />
      </div>
      <>
        <Chat />
      </>
    </>
  );
}
