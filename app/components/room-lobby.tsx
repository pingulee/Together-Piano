'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { BiSolidPiano } from 'react-icons/bi';
import { FaLock } from 'react-icons/fa6';

import IdentityPanel from '@/app/components/identity-panel';
import { useRooms } from '@/app/hooks/use-rooms';
import {
  DEFAULT_ROOM_ID,
  MAX_ROOM_ID_LENGTH,
  ROOM_CAPACITY,
  normalizeRoomId,
  roomPath,
} from '@/shared/room';

/**
 * 방 목록과 입장 화면.
 *
 * 방은 미리 만들어 두지 않습니다. 없는 이름으로 들어가면 그 자리에서 생기고
 * 만든 사람이 방장이 되며, 마지막 사람이 나가면 사라집니다. 그래서 '만들기'와
 * '들어가기'가 같은 동작이고, 링크만 공유하면 됩니다.
 */
export default function RoomLobby() {
  const rooms = useRooms();
  const router = useRouter();
  const [draft, setDraft] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const roomId = normalizeRoomId(draft) ?? DEFAULT_ROOM_ID;
    router.push(roomPath(roomId));
  };

  return (
    <div className='stage-light flex-1 overflow-y-auto'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12'>
        <header className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight'>연주실</h1>
          <p className='text-ink-muted text-sm'>
            이름을 적어 들어가면 그 방이 만들어집니다. 같은 이름으로 들어온
            사람과 함께 연주합니다.
          </p>
        </header>

        <section className='flex flex-col gap-3'>
          <form onSubmit={handleSubmit} className='flex flex-wrap gap-2'>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_ROOM_ID_LENGTH}
              placeholder={DEFAULT_ROOM_ID}
              aria-label='방 이름'
              className='border-line bg-surface focus:border-accent placeholder:text-ink-faint min-w-0 flex-1 rounded-lg border px-3.5 py-2.5 text-sm transition-colors outline-none'
            />
            <button
              type='submit'
              className='bg-accent hover:bg-accent-hot inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors'
            >
              <BiSolidPiano className='text-lg' />
              입장
            </button>
          </form>
          <p className='text-ink-faint text-xs'>
            한 방에 최대 {ROOM_CAPACITY}명 · 비워 두면 “{DEFAULT_ROOM_ID}”로
            들어갑니다
          </p>
        </section>

        <section className='flex flex-col gap-3'>
          <h2 className='text-ink-muted text-sm font-semibold'>
            지금 열려 있는 방 {rooms.length > 0 && `(${rooms.length})`}
          </h2>

          {rooms.length === 0 ? (
            <p className='border-line text-ink-faint rounded-xl border border-dashed px-4 py-8 text-center text-xs'>
              아직 아무도 없습니다. 첫 방을 만들어 보세요.
            </p>
          ) : (
            <ul className='flex flex-col gap-2'>
              {rooms.map((room) => (
                <li key={room.id}>
                  <Link
                    href={roomPath(room.id)}
                    className='border-line bg-surface/70 hover:border-line-strong flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors'
                  >
                    <span className='min-w-0 flex-1'>
                      <span className='flex items-center gap-1.5'>
                        <span className='truncate text-sm font-semibold'>
                          {room.id}
                        </span>
                        {room.locked && (
                          <FaLock
                            className='text-ink-faint shrink-0 text-[11px]'
                            aria-label='잠긴 방'
                          />
                        )}
                      </span>
                      {room.hostName && (
                        <span className='text-ink-faint block truncate text-xs'>
                          방장 {room.hostName}
                        </span>
                      )}
                    </span>

                    <span className='text-ink-muted shrink-0 font-mono text-xs'>
                      {room.count}/{ROOM_CAPACITY}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className='border-line bg-surface/70 flex flex-col gap-4 rounded-xl border p-5'>
          <div className='flex flex-col gap-1'>
            <h2 className='text-sm font-semibold'>내 프로필</h2>
            <p className='text-ink-faint text-xs'>
              로그인하지 않아도 됩니다. 이 브라우저에 저장되어 다음에도 같은
              이름·색으로 보입니다.
            </p>
          </div>
          <IdentityPanel />
        </section>
      </div>
    </div>
  );
}
