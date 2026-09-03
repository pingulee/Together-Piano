'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

import { socket } from '@/app/lib/socket';
import type { CursorPosition, RemoteCursor } from '@/shared/socket-events';

/** 좌표 전송 주기. 30Hz 면 눈에 부드럽고 대역폭도 적습니다. */
const SEND_INTERVAL_MS = 33;

/** 이 시간 동안 갱신이 없으면 탭이 멈춘 것으로 보고 지웁니다. */
const STALE_AFTER_MS = 10_000;
const SWEEP_INTERVAL_MS = 2000;

export interface SharedCursorState {
  /** 그려야 할 커서의 소유자 id. 커서가 생기거나 사라질 때만 바뀝니다. */
  ids: string[];
  /**
   * id -> 최신 정규화 좌표.
   *
   * 좌표 자체는 React 상태가 아닙니다. 초당 30번 들어오는 값을 상태로 두면
   * 참가자 수만큼 배가되어 무대 전체(건반 88개·리본)가 계속 리렌더됩니다.
   * 렌더 대상은 `ids` 로만 정하고, 위치는 프레임 루프가 DOM 에 직접 씁니다.
   */
  positions: RefObject<Map<string, CursorPosition>>;
}

/**
 * 참가자들의 마우스 위치를 주고받습니다.
 *
 * 좌표는 무대 요소를 기준으로 0~1 로 정규화해 보냅니다. 화면 픽셀을 그대로
 * 보내면 창 크기가 다른 사람에게 엉뚱한 곳을 가리키게 됩니다.
 *
 * @param stageRef 좌표의 기준이 되는 요소
 */
export function useSharedCursors(
  stageRef: RefObject<HTMLElement | null>,
): SharedCursorState {
  const [ids, setIds] = useState<string[]>([]);
  const positions = useRef(new Map<string, CursorPosition>());
  const seenAt = useRef(new Map<string, number>());

  const forget = useCallback((id: string) => {
    if (!positions.current.has(id)) return;
    positions.current.delete(id);
    seenAt.current.delete(id);
    setIds((prev) => prev.filter((entry) => entry !== id));
  }, []);

  // 내 좌표 전송
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    /** 마지막 포인터 위치(화면 좌표). 정규화는 전송 시점에 한 번만 합니다. */
    let pendingX = 0;
    let pendingY = 0;
    let hasPending = false;
    let lastSentAt = 0;
    let frame = 0;

    const handleMove = (event: PointerEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      hasPending = true;
    };

    const handleLeave = () => {
      hasPending = false;
      socket.emit('cursorLeave');
    };

    /**
     * 포인터 이벤트마다 보내면 초당 수백 건이 되므로 프레임 루프에서 솎아냅니다.
     *
     * `getBoundingClientRect` 도 여기서만 부릅니다. 이동 핸들러에서 부르면
     * 마우스를 움직이는 동안 초당 수백 번 레이아웃을 강제로 계산하게 됩니다.
     */
    const pump = (now: number) => {
      frame = requestAnimationFrame(pump);
      if (!hasPending || now - lastSentAt < SEND_INTERVAL_MS) return;

      const bounds = stage.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      lastSentAt = now;
      hasPending = false;
      socket.emit('cursorMove', {
        x: (pendingX - bounds.left) / bounds.width,
        y: (pendingY - bounds.top) / bounds.height,
      });
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
      const isNew = !positions.current.has(id);
      positions.current.set(id, { x, y });
      seenAt.current.set(id, Date.now());

      // 노드를 새로 붙여야 할 때만 리렌더합니다.
      if (isNew) setIds((prev) => [...prev, id]);
    };

    socket.on('cursorMove', handleMove);
    socket.on('cursorLeave', forget);

    return () => {
      socket.off('cursorMove', handleMove);
      socket.off('cursorLeave', forget);
    };
  }, [forget]);

  // 갱신이 끊긴 커서 정리
  useEffect(() => {
    const sweep = setInterval(() => {
      const cutoff = Date.now() - STALE_AFTER_MS;
      for (const [id, at] of seenAt.current) {
        if (at < cutoff) forget(id);
      }
    }, SWEEP_INTERVAL_MS);

    return () => clearInterval(sweep);
  }, [forget]);

  return { ids, positions };
}
