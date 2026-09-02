import Chat from '@/app/components/chat';
import PianoKeyboard from '@/app/components/piano-keyboard';
import SocketConnection from '@/app/providers/socket-connection';

export default function PianoPage() {
  return (
    <SocketConnection>
      <div className='flex w-full flex-col justify-center'>
        <PianoKeyboard />
      </div>
      <Chat />
    </SocketConnection>
  );
}
