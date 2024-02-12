'use client';

import Chat from '@/app/components/chat/chat.component';
import PianoContainer from '@/app/components/piano/piano-container.component';
import Room from '@/app/components/room/room.component';
import Setting from '@/app/components/setting/setting.component';
import { useEffect } from 'react';

export default function PianoPage() {
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (midiAccess) => {
          console.log('MIDI access obtained');
          // 여기서 MIDI 초기화 로직을 추가할 수 있습니다.
          // 예를 들어, 사용 가능한 출력 장치를 선택하고 저장할 수 있습니다.
        },
        () => {
          console.error('Could not access MIDI devices.');
        }
      );
    }
  }, []);
  return (
    <>
      <div className='flex flex-col w-full justify-between'>
        <Room />
        <PianoContainer />
        <Setting />
      </div>
      <>
        <Chat />
      </>
    </>
  );
}
