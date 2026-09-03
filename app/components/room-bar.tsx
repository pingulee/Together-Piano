'use client';

import Link from 'next/link';
import { FaCrown, FaLock, FaLockOpen } from 'react-icons/fa6';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { IoClose } from 'react-icons/io5';

import { ROOM_CAPACITY } from '@/shared/room';
import type { Participant } from '@/shared/socket-events';

interface RoomBarProps {
  roomId: string;
  participants: Participant[];
  selfId: string | null;
  isSelfHost: boolean;
  locked: boolean;
  onKick: (targetId: string) => void;
  onToggleLock: (locked: boolean) => void;
  loadedSamples: number;
  totalSamples: number;
}

/**
 * 무대 상단 바.
 *
 * 어느 방인지, 지금 누가 들어와 있는지, 각자 어떤 색으로 표시되는지를 보여
 * 줍니다. 건반과 커서에서 쓰는 색과 같은 값이라 화면에서 서로 연결됩니다.
 * 방장에게만 강퇴·잠금 버튼이 보입니다. (서버도 같은 조건을 다시 확인합니다)
 */
export default function RoomBar({
  roomId,
  participants,
  selfId,
  isSelfHost,
  locked,
  onKick,
  onToggleLock,
  loadedSamples,
  totalSamples,
}: RoomBarProps) {
  const isReady = totalSamples > 0 && loadedSamples >= totalSamples;

  return (
    <header className='border-line flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5'>
      <Link
        href='/piano'
        aria-label='방 목록으로'
        className='text-ink-faint hover:bg-raised hover:text-ink shrink-0 rounded-md p-1.5 transition-colors'
      >
        <HiOutlineArrowLeft />
      </Link>

      <div className='flex min-w-0 shrink-0 items-center gap-2'>
        <h1 className='max-w-48 truncate text-sm font-bold'>{roomId}</h1>
        {locked && (
          <FaLock className='text-ink-faint text-[11px]' aria-label='잠긴 방' />
        )}
        <span className='text-ink-faint shrink-0 font-mono text-xs'>
          {participants.length}/{ROOM_CAPACITY}
        </span>
      </div>

      <ul className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5'>
        {participants.map((participant) => {
          const isSelf = participant.id === selfId;
          const canKick = isSelfHost && !isSelf;

          return (
            <li
              key={participant.id}
              className='border-line bg-raised flex max-w-44 items-center gap-1.5 rounded-full border py-0.5 pr-2 pl-2 text-xs'
            >
              <span
                className='size-2 shrink-0 rounded-full'
                style={{ backgroundColor: participant.color }}
                aria-hidden='true'
              />
              {participant.isHost && (
                <FaCrown
                  className='shrink-0 text-[10px] text-amber-400'
                  aria-label='방장'
                />
              )}
              <span className='text-ink-muted truncate'>
                {participant.name}
              </span>
              {isSelf && (
                <span className='text-accent-hot shrink-0 text-[10px] font-semibold'>
                  나
                </span>
              )}
              {canKick && (
                <button
                  type='button'
                  aria-label={`${participant.name} 내보내기`}
                  onClick={() => onKick(participant.id)}
                  className='text-ink-faint hover:text-accent-hot -mr-1 shrink-0 rounded-full p-0.5 transition-colors'
                >
                  <IoClose />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {isSelfHost && (
        <button
          type='button'
          onClick={() => onToggleLock(!locked)}
          aria-pressed={locked}
          className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
            locked
              ? 'border-accent bg-accent/15 text-accent-hot'
              : 'border-line text-ink-muted hover:border-line-strong hover:text-ink'
          }`}
        >
          {locked ? <FaLock /> : <FaLockOpen />}
          {locked ? '잠김' : '잠그기'}
        </button>
      )}

      {!isReady && (
        <div className='text-ink-faint flex shrink-0 items-center gap-2 text-xs'>
          <span>
            사운드 {loadedSamples}/{totalSamples}
          </span>
          <span className='bg-line h-1 w-20 overflow-hidden rounded-full'>
            <span
              className='bg-accent block h-full transition-[width] duration-300'
              style={{
                width: totalSamples
                  ? `${(loadedSamples / totalSamples) * 100}%`
                  : '0%',
              }}
            />
          </span>
        </div>
      )}
    </header>
  );
}
