'use client';

import { memo } from 'react';

import { formatNoteLabel, type PianoKey as PianoKeyDef } from '@/app/lib/notes';

interface PianoKeyProps {
  keyDef: PianoKeyDef;
  geometry: { left: number; width: number };
  /** 누른 사람의 색. 눌려 있지 않으면 null 입니다. */
  activeColor: string | null;
  /** 이 건반에 배정된 컴퓨터 키보드 글자 (없으면 표시하지 않습니다) */
  shortcut: string | null;
  showLabel: boolean;
  isOctaveMarker: boolean;
}

/**
 * 건반 하나.
 *
 * 흰건반은 가로를 균등 분할하고, 검은건반은 그 경계 위에 절대 위치로 얹힙니다.
 * 이전 구현은 검은건반도 같은 flex 흐름에 넣고 음수 마진으로 끌어당겼는데,
 * 그러면 위치가 어긋나고 옥타브마다 오차가 누적됩니다.
 *
 * `memo` 로 감싼 이유: 음 하나를 누르면 부모가 새 색 목록을 받아 88개를 모두
 * 다시 렌더합니다. 프로퍼티가 모두 원시값이거나 모듈 상수에서 온 고정 참조라
 * 실제로 바뀐 건반만 갱신됩니다.
 */
function PianoKeyView({
  keyDef,
  geometry,
  activeColor,
  shortcut,
  showLabel,
  isOctaveMarker,
}: PianoKeyProps) {
  const { note, isBlack } = keyDef;
  const isActive = activeColor !== null;

  return (
    <button
      type='button'
      // 포인터로 누르는 조작은 부모가 위임 처리하므로 탭 순서에서만 뺍니다.
      tabIndex={-1}
      aria-label={formatNoteLabel(note)}
      aria-pressed={isActive}
      data-note={note}
      data-active={isActive}
      className={`piano-key ${isBlack ? 'piano-key-black' : 'piano-key-white'}`}
      style={{
        left: `${geometry.left}%`,
        width: `${geometry.width}%`,
        ...(isActive ? { ['--key-color' as string]: activeColor } : {}),
      }}
    >
      <span
        className={`text-2xs pointer-events-none absolute inset-x-0 bottom-1.5 flex flex-col items-center gap-0.5 leading-none font-semibold ${
          isBlack ? 'text-white/45' : 'text-black/35'
        }`}
      >
        {showLabel && shortcut && (
          <span className='font-mono uppercase'>{shortcut}</span>
        )}
        {isOctaveMarker && (
          <span className='text-2xs font-bold text-black/45'>
            {formatNoteLabel(note)}
          </span>
        )}
      </span>
    </button>
  );
}

const PianoKey = memo(PianoKeyView);
export default PianoKey;
