'use client';

import { useEffect, useRef } from 'react';

import type { SharedCursorState } from '@/app/hooks/use-shared-cursors';
import { FALLBACK_PARTICIPANT_COLOR } from '@/shared/participant-colors';
import type { Participant } from '@/shared/socket-events';

interface SharedCursorsProps {
  cursors: SharedCursorState;
  participants: Participant[];
  /** 자기 커서는 브라우저가 이미 그리므로 제외합니다. */
  selfId: string | null;
}

/**
 * 다른 참가자의 마우스 위치를 무대 위에 겹쳐 그립니다.
 *
 * 위치는 프레임 루프가 `transform` 으로 직접 씁니다. `left`/`top` 을 바꾸면
 * 매 프레임 레이아웃이 다시 계산되지만, `translate3d` 는 합성 단계에서만
 * 처리되어 다른 렌더링을 붙잡지 않습니다.
 *
 * 포인터 이벤트를 받지 않으므로 아래 건반 조작을 가리지 않습니다.
 */
export default function SharedCursors({
  cursors,
  participants,
  selfId,
}: SharedCursorsProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());

  const { ids, positions } = cursors;
  const count = ids.length;

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || count === 0) return;

    // 오버레이 크기는 창 크기가 바뀔 때만 달라지므로 매 프레임 읽지 않습니다.
    let width = overlay.clientWidth;
    let height = overlay.clientHeight;

    const observer = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    observer.observe(overlay);

    let frame = requestAnimationFrame(function tick() {
      frame = requestAnimationFrame(tick);

      for (const [id, node] of nodes.current) {
        const position = positions.current.get(id);
        if (!position) continue;

        node.style.transform = `translate3d(${position.x * width}px, ${
          position.y * height
        }px, 0)`;

        // 첫 좌표를 적용한 뒤에 보이게 해, 원점에서 날아오는 것처럼 보이지 않게 합니다.
        if (node.dataset.ready !== 'true') node.dataset.ready = 'true';
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [count, positions]);

  const byId = new Map(participants.map((entry) => [entry.id, entry]));

  return (
    <div
      ref={overlayRef}
      className='pointer-events-none absolute inset-0 z-30 overflow-hidden'
    >
      {ids.map((id) => {
        if (id === selfId) return null;

        const participant = byId.get(id);
        const color = participant?.color ?? FALLBACK_PARTICIPANT_COLOR;

        return (
          <div
            key={id}
            ref={(node) => {
              if (node) nodes.current.set(id, node);
              return () => {
                nodes.current.delete(id);
              };
            }}
            className='remote-cursor'
            data-ready='false'
            style={{ color }}
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
                className='text-canvas text-2xs -mt-1 ml-3 inline-block max-w-32 truncate rounded-full px-2 py-0.5 leading-tight font-semibold'
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
