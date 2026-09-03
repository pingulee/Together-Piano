'use client';

import { useCurrentTime } from '@/app/hooks/use-current-time';

/**
 * 한국 시간 표시.
 *
 * 서버 렌더 결과와 어긋나지 않도록 첫 프레임에는 자리만 잡아 두고,
 * 마운트 이후에 실제 시각을 채웁니다.
 */
export default function KoreaClock() {
  const time = useCurrentTime();

  return (
    <div className='flex items-baseline gap-3'>
      <span className='text-ink-faint text-xs font-medium tracking-widest uppercase'>
        Seoul
      </span>
      <span
        className='text-ink-muted font-mono text-lg tabular-nums'
        // 값이 채워지기 전에도 자리를 차지해 레이아웃이 흔들리지 않게 합니다.
        style={{ minWidth: '13ch' }}
      >
        {time ?? '—'}
      </span>
    </div>
  );
}
