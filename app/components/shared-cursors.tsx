'use client';

import { FALLBACK_PARTICIPANT_COLOR } from '@/shared/participant-colors';
import type { CursorPosition, Participant } from '@/shared/socket-events';

interface SharedCursorsProps {
  cursors: Map<string, CursorPosition>;
  participants: Participant[];
  /** 자기 커서는 브라우저가 이미 그리므로 제외합니다. */
  selfId: string | null;
}

/**
 * 다른 참가자의 마우스 위치를 무대 위에 겹쳐 그립니다.
 *
 * 좌표는 0~1 정규화 값이라 퍼센트로 그대로 배치할 수 있습니다.
 * 포인터 이벤트를 받지 않으므로 아래 건반 조작을 가리지 않습니다.
 */
export default function SharedCursors({
  cursors,
  participants,
  selfId,
}: SharedCursorsProps) {
  const byId = new Map(participants.map((entry) => [entry.id, entry]));

  return (
    <div className='pointer-events-none absolute inset-0 z-30 overflow-hidden'>
      {[...cursors].map(([id, position]) => {
        if (id === selfId) return null;

        const participant = byId.get(id);
        const color = participant?.color ?? FALLBACK_PARTICIPANT_COLOR;

        return (
          <div
            key={id}
            className='remote-cursor'
            style={{
              left: `${position.x * 100}%`,
              top: `${position.y * 100}%`,
              color,
            }}
          >
            <svg
              width='18'
              height='22'
              viewBox='0 0 18 22'
              aria-hidden='true'
              className='drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]'
            >
              <path
                d='M1 1l14.5 8.2-6.4 1.2 3.3 7.1-2.6 1.2-3.3-7.1L3 16.6z'
                fill='currentColor'
                stroke='rgba(0,0,0,0.45)'
                strokeWidth='1'
              />
            </svg>

            {participant && (
              <span
                className='text-canvas -mt-1 ml-3 inline-block max-w-32 truncate rounded-full px-2 py-0.5 text-[11px] leading-tight font-semibold'
                style={{ backgroundColor: color }}
              >
                {participant.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
