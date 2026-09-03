'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { FaLock } from 'react-icons/fa6';
import { HiArrowRight } from 'react-icons/hi2';

import IdentityPanel from '@/app/components/identity-panel';
import { Badge, LiveDot } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/field';
import { Panel, SectionHeading } from '@/app/components/ui/panel';
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
 * '들어가기'가 같은 입력 하나이고, 링크만 공유하면 됩니다.
 */
export default function RoomLobby() {
  const rooms = useRooms();
  const router = useRouter();
  const [draft, setDraft] = useState('');

  const playerCount = rooms.reduce((total, room) => total + room.count, 0);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    router.push(roomPath(normalizeRoomId(draft) ?? DEFAULT_ROOM_ID));
  };

  return (
    <div className='stage-light flex-1 overflow-y-auto'>
      <div className='mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10 sm:px-8'>
        <header className='flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <h1 className='text-2xl font-bold'>연주실</h1>
            {playerCount > 0 && (
              <Badge tone='live'>
                <LiveDot />
                {playerCount}명 연주 중
              </Badge>
            )}
          </div>
          <p className='text-ink-muted text-sm'>
            방 이름을 적어 들어가면 그 방이 만들어집니다. 같은 이름으로 들어온
            사람과 함께 연주합니다.
          </p>
        </header>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_ROOM_ID_LENGTH}
              placeholder={DEFAULT_ROOM_ID}
              aria-label='방 이름'
              className='h-11 flex-1'
            />
            <Button type='submit' variant='primary' className='h-11 px-5'>
              입장
              <HiArrowRight />
            </Button>
          </div>
          <p className='text-ink-faint text-2xs'>
            한 방에 최대 {ROOM_CAPACITY}명 · 비워 두면 “{DEFAULT_ROOM_ID}”로
            들어갑니다
          </p>
        </form>

        <section className='flex flex-col gap-3'>
          <SectionHeading
            title='열려 있는 방'
            action={
              rooms.length > 0 ? (
                <Badge tone='strong'>{rooms.length}</Badge>
              ) : undefined
            }
          />

          {rooms.length === 0 ? (
            <Panel tone='empty' padding='lg'>
              <p className='text-ink-faint text-center text-xs'>
                아직 열린 방이 없습니다. 위에 이름을 적어 첫 방을 만들어 보세요.
              </p>
            </Panel>
          ) : (
            <ul className='flex flex-col gap-1.5'>
              {rooms.map((room) => (
                <li key={room.id}>
                  <Link
                    href={roomPath(room.id)}
                    className='border-line bg-surface hover:border-line-strong hover:bg-raised group flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors'
                  >
                    <span className='flex min-w-0 flex-1 flex-col gap-0.5'>
                      <span className='flex items-center gap-1.5'>
                        <span className='truncate text-sm font-semibold'>
                          {room.id}
                        </span>
                        {room.locked && (
                          <FaLock
                            className='text-ink-faint text-2xs shrink-0'
                            aria-label='잠긴 방'
                          />
                        )}
                      </span>
                      {room.hostName && (
                        <span className='text-ink-faint text-2xs truncate'>
                          방장 {room.hostName}
                        </span>
                      )}
                    </span>

                    {/* 인원을 막대로도 보여 줘 목록을 훑을 때 한눈에 비교됩니다. */}
                    <span
                      className='bg-line hidden h-1 w-16 shrink-0 overflow-hidden rounded-full sm:block'
                      aria-hidden='true'
                    >
                      <span
                        className='bg-ink-faint block h-full rounded-full'
                        style={{
                          width: `${(room.count / ROOM_CAPACITY) * 100}%`,
                        }}
                      />
                    </span>
                    <span className='text-ink-muted shrink-0 font-mono text-xs tabular-nums'>
                      {room.count}/{ROOM_CAPACITY}
                    </span>
                    <HiArrowRight className='text-ink-faint group-hover:text-ink shrink-0 transition-colors' />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Panel as='section' padding='lg' className='flex flex-col gap-4'>
          <SectionHeading
            title='내 프로필'
            description='로그인하지 않아도 됩니다. 이 브라우저에 저장되어 다음에도 같은 이름·색으로 보입니다.'
          />
          <IdentityPanel />
        </Panel>
      </div>
    </div>
  );
}
