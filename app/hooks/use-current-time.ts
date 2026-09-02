'use client';

import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Seoul';
const REFRESH_INTERVAL_MS = 1000;

const formatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone: TIME_ZONE,
  hour12: false,
});

/**
 * 한국 시간을 1초마다 갱신해 반환합니다.
 *
 * 서버 렌더 결과와 어긋나지 않도록 최초 값은 null 이며,
 * 마운트 이후 첫 프레임에서 실제 시각이 채워집니다.
 */
export function useCurrentTime(): string | null {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatter.format(new Date()));

    update();
    const intervalId = setInterval(update, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return time;
}
