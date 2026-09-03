'use client';

import { FaLock, FaLockOpen } from 'react-icons/fa6';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

import ParticipantChip from '@/app/components/participant-chip';
import { Badge } from '@/app/components/ui/badge';
import { Button, IconButtonLink } from '@/app/components/ui/button';
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
 * 방장에게만 강퇴·잠금이 보입니다. (서버도 같은 조건을 다시 확인합니다)
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
    <header className='border-line bg-surface/50 flex shrink-0 items-center gap-3 border-b px-3 py-2 backdrop-blur'>
      <IconButtonLink
        href='/piano'
        label='방 목록으로'
        icon={<HiOutlineArrowLeft />}
        size='sm'
      />

      <div className='flex min-w-0 shrink-0 items-center gap-2'>
        <h1 className='max-w-40 truncate text-sm font-semibold'>{roomId}</h1>
        {locked && (
          <FaLock className='text-ink-faint text-2xs' aria-label='잠긴 방' />
        )}
        <Badge tone='strong' className='font-mono tabular-nums'>
          {participants.length}/{ROOM_CAPACITY}
        </Badge>
      </div>

      <div className='border-line h-5 w-px shrink-0' />

      <ul className='flex min-w-0 flex-1 flex-wrap items-center gap-1.5'>
        {participants.map((participant) => (
          <li key={participant.id}>
            <ParticipantChip
              participant={participant}
              isSelf={participant.id === selfId}
              onKick={isSelfHost ? onKick : undefined}
            />
          </li>
        ))}
      </ul>

      {!isReady && (
        <div className='text-ink-faint text-2xs flex shrink-0 items-center gap-2'>
          <span className='tabular-nums'>
            사운드 {loadedSamples}/{totalSamples}
          </span>
          <span className='bg-line h-1 w-16 overflow-hidden rounded-full'>
            <span
              className='bg-ink-faint block h-full rounded-full transition-[width] duration-300'
              style={{
                width: totalSamples
                  ? `${(loadedSamples / totalSamples) * 100}%`
                  : '0%',
              }}
            />
          </span>
        </div>
      )}

      {isSelfHost && (
        <Button
          size='sm'
          variant={locked ? 'primary' : 'ghost'}
          aria-pressed={locked}
          onClick={() => onToggleLock(!locked)}
          className='shrink-0'
        >
          {locked ? <FaLock /> : <FaLockOpen />}
          {locked ? '잠김' : '잠그기'}
        </Button>
      )}
    </header>
  );
}
