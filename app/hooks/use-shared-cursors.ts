'use client';

import { useEffect, useState, type RefObject } from 'react';

import { socket } from '@/app/lib/socket';
import type { CursorPosition, RemoteCursor } from '@/shared/socket-events';

/** 좌표 전송 주기. 30Hz 면 눈에 부드럽고 대역폭도 적습니다. */
const SEND_INTERVAL_MS = 33;

/** 이 시간 동안 갱신이 없으면 탭이 멈춘 것으로 보고 지웁니다. */
const STALE_AFTER_MS = 10_000;
const SWEEP_INTERVAL_MS = 2000;

interface TrackedCursor extends CursorPosition {
  updatedAt: number;
}

/**
 * 참가자들의 마우스 위치를 주고받습니다.
 *
 * 좌표는 무대 요소를 기준으로 0~1 로 정규화해 보냅니다. 화면 픽셀을 그대로
 * 보내면 창 크기가 다른 사람에게 엉뚱한 곳을 가리키게 됩니다.
 *
 * @param stageRef 좌표의 기준이 되는 요소
 * @returns 참가자 id -> 정규화 좌표
 */
export function useSharedCursors(
  stageRef: RefObject<HTMLElement | null>,
): Map<string, CursorPosition> {
  const [cursors, setCursors] = useState<Map<string, TrackedCursor>>(
    () => new Map(),
  );

  // 내 좌표 전송
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let pending: CursorPosition | null = null;
    let lastSentAt = 0;
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      pending = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
      };
    };

    const handleLeave = () => {
      pending = null;
      socket.emit('cursorLeave');
    };

    // 포인터 이벤트마다 보내면 초당 수백 건이 되므로 프레임 루프에서 솎아냅니다.
    const pump = (now: number) => {
      frame = requestAnimationFrame(pump);
      if (!pending || now - lastSentAt < SEND_INTERVAL_MS) return;

      lastSentAt = now;
      socket.emit('cursorMove', pending);
      pending = null;
    };

    stage.addEventListener('pointermove', handleMove);
    stage.addEventListener('pointerleave', handleLeave);
    frame = requestAnimationFrame(pump);

    return () => {
      stage.removeEventListener('pointermove', handleMove);
      stage.removeEventListener('pointerleave', handleLeave);
      cancelAnimationFrame(frame);
      socket.emit('cursorLeave');
    };
  }, [stageRef]);

  // 다른 사람 좌표 수신
  useEffect(() => {
    const handleMove = ({ id, x, y }: RemoteCursor) => {
      setCursors((prev) => {
        const next = new Map(prev);
        next.set(id, { x, y, updatedAt: Date.now() });
        return next;
      });
    };

    const handleLeave = (id: string) => {
      setCursors((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    };

    socket.on('cursorMove', handleMove);
    socket.on('cursorLeave', handleLeave);

    return () => {
      socket.off('cursorMove', handleMove);
      socket.off('cursorLeave', handleLeave);
    };
  }, []);

  // 갱신이 끊긴 커서 정리
  useEffect(() => {
    const sweep = setInterval(() => {
      setCursors((prev) => {
        const cutoff = Date.now() - STALE_AFTER_MS;
        const stale = [...prev].filter(
          ([, cursor]) => cursor.updatedAt < cutoff,
        );
        if (stale.length === 0) return prev;

        const next = new Map(prev);
        for (const [id] of stale) next.delete(id);
        return next;
      });
    }, SWEEP_INTERVAL_MS);

    return () => clearInterval(sweep);
  }, []);

  return cursors;
}
