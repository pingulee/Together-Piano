'use client';

import type { Participant } from '@/shared/socket-events';

/** 이름까지 다 보여 주면 넘치므로 이 수를 넘으면 나머지는 숫자로 묶습니다. */
const MAX_VISIBLE_PARTICIPANTS = 6;

interface RoomBarProps {
  participants: Participant[];
  selfId: string | null;
  loadedSamples: number;
  totalSamples: number;
}

/**
 * 무대 상단 바.
 *
 * 지금 누가 들어와 있는지, 각자 어떤 색으로 표시되는지를 보여 줍니다.
 * 건반과 커서에서 쓰는 색과 같은 값이라 화면에서 서로 연결됩니다.
 */
export default function RoomBar({
  participants,
  selfId,
  loadedSamples,
  totalSamples,
}: RoomBarProps) {
  const visible = participants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const overflow = participants.length - visible.length;
  const isReady = totalSamples > 0 && loadedSamples >= totalSamples;

  return (
    <header className='border-line flex shrink-0 items-center gap-4 border-b px-4 py-3'>
      <div className='flex items-center gap-2'>
        <span
          className={`size-2 rounded-full ${
            participants.length > 0 ? 'bg-emerald-400' : 'bg-ink-faint'
          }`}
          aria-hidden='true'
        />
        <span className='text-sm font-semibold'>
          {participants.length}명 연주 중
        </span>
      </div>

      <ul className='flex min-w-0 flex-wrap items-center gap-1.5'>
        {visible.map((participant) => (
          <li
            key={participant.id}
            className='border-line bg-raised flex max-w-40 items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs'
          >
            <span
              className='size-2 shrink-0 rounded-full'
              style={{ backgroundColor: participant.color }}
              aria-hidden='true'
            />
            <span className='text-ink-muted truncate'>{participant.name}</span>
            {participant.id === selfId && (
              <span className='text-accent-hot shrink-0 text-[10px] font-semibold'>
                나
              </span>
            )}
          </li>
        ))}

        {overflow > 0 && (
          <li className='border-line text-ink-faint rounded-full border px-2 py-0.5 text-xs'>
            +{overflow}
          </li>
        )}
      </ul>

      {!isReady && (
        <div className='text-ink-faint ml-auto flex shrink-0 items-center gap-2 text-xs'>
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
