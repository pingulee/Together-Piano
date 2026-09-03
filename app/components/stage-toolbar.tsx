'use client';

import { HiChevronDown } from 'react-icons/hi2';

import IdentityPanel from '@/app/components/identity-panel';
import { Badge } from '@/app/components/ui/badge';
import { Slider, Switch } from '@/app/components/ui/field';
import { Panel } from '@/app/components/ui/panel';
import { MAX_BASE_OCTAVE, MIN_BASE_OCTAVE } from '@/app/lib/keyboard-map';

interface StageToolbarProps {
  baseOctave: number;
  onBaseOctaveChange: (octave: number) => void;
  showLabels: boolean;
  onShowLabelsChange: (show: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  sustainDown: boolean;
  isLoading: boolean;
}

/** 연주 설정 줄. 소리와 표시에 관한 것만 두고 방 관리는 상단 바가 맡습니다. */
export default function StageToolbar({
  baseOctave,
  onBaseOctaveChange,
  showLabels,
  onShowLabelsChange,
  volume,
  onVolumeChange,
  sustainDown,
  isLoading,
}: StageToolbarProps) {
  return (
    <div className='border-line bg-surface/60 relative z-40 flex shrink-0 flex-wrap items-center gap-x-5 gap-y-2 border-t px-3 py-2 backdrop-blur'>
      <OctaveStepper value={baseOctave} onChange={onBaseOctaveChange} />

      <Switch
        label='키 안내'
        checked={showLabels}
        onChange={(event) => onShowLabelsChange(event.target.checked)}
      />

      <Slider
        label='볼륨'
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => onVolumeChange(Number(event.target.value))}
      />

      <Badge tone={sustainDown ? 'active' : 'neutral'}>서스테인 · Space</Badge>

      {isLoading && (
        <span className='text-ink-faint text-2xs'>사운드 준비 중…</span>
      )}

      {/*
        펼침 상태를 `details` 에 맡깁니다. React 상태로 들고 있으면 연주 중
        리렌더 경로에 하나가 더 얹히고, 이 패널은 그럴 이유가 없습니다.
      */}
      <details className='group ml-auto'>
        <summary className='border-line bg-raised text-ink-muted hover:border-line-strong hover:text-ink flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors'>
          내 프로필
          <HiChevronDown className='transition-transform group-open:rotate-180' />
        </summary>
        <Panel
          tone='overlay'
          padding='md'
          className='absolute right-3 bottom-full mb-2 w-64'
        >
          <IdentityPanel />
        </Panel>
      </details>
    </div>
  );
}

interface OctaveStepperProps {
  value: number;
  onChange: (octave: number) => void;
}

/** 컴퓨터 자판이 어느 옥타브를 누르는지 정합니다. */
function OctaveStepper({ value, onChange }: OctaveStepperProps) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-ink-faint text-xs'>옥타브</span>
      <div className='border-line bg-raised flex h-8 items-center overflow-hidden rounded-md border'>
        <button
          type='button'
          aria-label='기준 옥타브 낮추기'
          disabled={value <= MIN_BASE_OCTAVE}
          onClick={() => onChange(value - 1)}
          className='text-ink-muted hover:bg-overlay hover:text-ink h-full px-2 text-xs transition-colors disabled:pointer-events-none disabled:opacity-30'
        >
          −
        </button>
        <span className='border-line text-ink h-full min-w-9 border-x px-1 text-center font-mono text-xs leading-8 font-semibold tabular-nums'>
          C{value}
        </span>
        <button
          type='button'
          aria-label='기준 옥타브 올리기'
          disabled={value >= MAX_BASE_OCTAVE}
          onClick={() => onChange(value + 1)}
          className='text-ink-muted hover:bg-overlay hover:text-ink h-full px-2 text-xs transition-colors disabled:pointer-events-none disabled:opacity-30'
        >
          +
        </button>
      </div>
    </div>
  );
}
