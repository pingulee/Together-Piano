'use client';

import Chat from '@/app/components/chat/chat.component';

import Piano from '@/app/components/piano/piano.component';
import Room from '@/app/components/room/room.component';
import Setting from '@/app/components/setting/setting.component';
import { getUserIp } from '@/app/hooks/ip/ip.hook';

export default function PianoPage() {
  return (
    <>
      <div className='flex flex-col w-full justify-between'>
        <Room />
        <Piano />
        <Setting />
      </div>
      <>
        <Chat />
      </>
    </>
  );
}
