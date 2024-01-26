'use client';

import Chat from '@/app/components/chat/chat.component';
import PianoContainer from '@/app/components/piano/piano-container.component';

export default function Piano() {
  return (
    <main className='flex flex-row w-full'>
      <div className='flex-grow-7 w-full'>
        <PianoContainer />
      </div>
      <>
        <Chat />
      </>
    </main>
  );
}
