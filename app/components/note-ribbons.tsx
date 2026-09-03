'use client';

import { useEffect, useRef } from 'react';

import type { Ribbon } from '@/app/hooks/use-piano-session';
import { KEY_GEOMETRY } from '@/app/lib/notes';

/** 누르고 있는 동안 리본이 자라는 속도 */
const GROWTH_PX_PER_SECOND = 170;
/** 아무리 길게 눌러도 이 높이를 넘지 않습니다. */
const MAX_HEIGHT_PX = 240;
/** 짧게 톡 눌러도 보이도록 하는 최소 높이 */
const MIN_HEIGHT_PX = 8;

interface NoteRibbonsProps {
  ribbons: Ribbon[];
}

/**
 * 누른 건반 위로 연주자 색 띠를 띄웁니다.
 *
 * 누르고 있는 동안의 높이 갱신은 프레임 루프에서 DOM 을 직접 건드립니다.
 * 매 프레임 React 상태를 바꾸면 60fps 로 리렌더가 돌아 다른 조작까지 느려집니다.
 * 상태는 음이 시작·종료될 때만 바뀌고, 뗀 뒤의 상승·소멸은 CSS 애니메이션이 맡습니다.
 */
export default function NoteRibbons({ ribbons }: NoteRibbonsProps) {
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const current = useRef<Ribbon[]>([]);

  useEffect(() => {
    current.current = ribbons;
  }, [ribbons]);

  useEffect(() => {
    let frame = requestAnimationFrame(function tick(now) {
      frame = requestAnimationFrame(tick);

      for (const ribbon of current.current) {
        // 뗀 뒤에는 높이를 고정해 두고 CSS 애니메이션이 띄워 보냅니다.
        if (ribbon.released) continue;

        const node = nodes.current.get(ribbon.key);
        if (!node) continue;

        const seconds = (now - ribbon.startedAt) / 1000;
        const height = Math.min(
          Math.max(seconds * GROWTH_PX_PER_SECOND, MIN_HEIGHT_PX),
          MAX_HEIGHT_PX,
        );
        node.style.height = `${height}px`;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className='pointer-events-none absolute inset-x-0 bottom-0 z-10 h-full overflow-hidden'>
      {ribbons.map((ribbon) => {
        const geometry = KEY_GEOMETRY.get(ribbon.note);
        if (!geometry) return null;

        return (
          <div
            key={ribbon.key}
            ref={(node) => {
              if (node) nodes.current.set(ribbon.key, node);
              return () => {
                nodes.current.delete(ribbon.key);
              };
            }}
            className='note-ribbon'
            data-released={ribbon.released}
            style={{
              left: `${geometry.left}%`,
              width: `${geometry.width}%`,
              height: `${MIN_HEIGHT_PX}px`,
              ['--ribbon-color' as string]: ribbon.color,
            }}
          />
        );
      })}
    </div>
  );
}
