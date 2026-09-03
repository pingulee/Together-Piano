'use client';

import { useEffect, useRef } from 'react';

import type { Ribbon } from '@/app/hooks/use-piano-session';
import { KEY_GEOMETRY } from '@/app/lib/notes';

/**
 * 누르고 있는 동안 리본이 자라는 속도 (레인 높이 대비 초당 비율).
 *
 * 픽셀이 아니라 비율이라 화면 높이에 관계없이 같은 시간에 끝까지 찹니다.
 */
const GROWTH_PER_SECOND = 0.5;

/** 짧게 톡 눌러도 보이도록 하는 최소 비율 */
const MIN_SCALE = 0.03;

interface NoteRibbonsProps {
  ribbons: Ribbon[];
}

/**
 * 누른 건반 위로 연주자 색 띠를 띄웁니다.
 *
 * 자라는 동안의 갱신은 프레임 루프가 DOM 을 직접 건드립니다. 매 프레임 React
 * 상태를 바꾸면 60fps 로 리렌더가 돌아 다른 조작까지 느려집니다. 상태는 음이
 * 시작·종료될 때만 바뀌고, 뗀 뒤의 상승·소멸은 CSS 애니메이션이 맡습니다.
 *
 * 높이를 직접 바꾸지 않고 `scaleY` 로 늘립니다. `height` 는 레이아웃을 다시
 * 계산시키므로 리본이 수십 개 쌓이면 프레임이 밀립니다. 바깥 노드는 뗀 뒤의
 * 이동을, 안쪽 노드는 자라기를 각각 담당해 두 transform 이 충돌하지 않습니다.
 */
export default function NoteRibbons({ ribbons }: NoteRibbonsProps) {
  const fills = useRef(new Map<string, HTMLDivElement>());
  const current = useRef<Ribbon[]>([]);

  const count = ribbons.length;

  // 프레임 루프가 읽을 최신 목록. 렌더 중에 ref 를 쓰지 않도록 이펙트에서 넘깁니다.
  useEffect(() => {
    current.current = ribbons;
  }, [ribbons]);

  useEffect(() => {
    // 아무것도 없으면 루프를 돌리지 않습니다. 빈 화면에서 60fps 로 깨어 있을 이유가 없습니다.
    if (count === 0) return;

    let frame = requestAnimationFrame(function tick(now) {
      frame = requestAnimationFrame(tick);

      for (const ribbon of current.current) {
        // 뗀 뒤에는 자란 만큼 그대로 두고 CSS 애니메이션이 띄워 보냅니다.
        if (ribbon.released) continue;

        const fill = fills.current.get(ribbon.key);
        if (!fill) continue;

        const seconds = (now - ribbon.startedAt) / 1000;
        const scale = Math.min(
          Math.max(seconds * GROWTH_PER_SECOND, MIN_SCALE),
          1,
        );
        fill.style.transform = `scaleY(${scale})`;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [count]);

  return (
    <div className='pointer-events-none absolute inset-0 z-10 overflow-hidden'>
      {ribbons.map((ribbon) => {
        const geometry = KEY_GEOMETRY.get(ribbon.note);
        if (!geometry) return null;

        return (
          <div
            key={ribbon.key}
            className='note-ribbon'
            data-released={ribbon.released}
            style={{
              left: `${geometry.left}%`,
              width: `${geometry.width}%`,
              ['--ribbon-color' as string]: ribbon.color,
            }}
          >
            <div
              ref={(node) => {
                if (node) fills.current.set(ribbon.key, node);
                return () => {
                  fills.current.delete(ribbon.key);
                };
              }}
              className='note-ribbon-fill'
            />
          </div>
        );
      })}
    </div>
  );
}
