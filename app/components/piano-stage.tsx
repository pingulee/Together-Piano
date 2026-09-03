'use client';

import { useEffect, useRef, useState } from 'react';

import NoteRibbons from '@/app/components/note-ribbons';
import PianoKeyboard from '@/app/components/piano-keyboard';
import RoomBar from '@/app/components/room-bar';
import SharedCursors from '@/app/components/shared-cursors';
import { usePianoSession } from '@/app/hooks/use-piano-session';
import { useSharedCursors } from '@/app/hooks/use-shared-cursors';
import {
  getMasterVolume,
  onLoadProgress,
  setMasterVolume,
  type LoadProgress,
} from '@/app/lib/audio';
import {
  DEFAULT_BASE_OCTAVE,
  MAX_BASE_OCTAVE,
  MIN_BASE_OCTAVE,
} from '@/app/lib/keyboard-map';

/** 88건반을 알아볼 수 있는 최소 폭. 이보다 좁으면 가로로 스크롤합니다. */
const MIN_KEYBOARD_WIDTH_PX = 960;

export default function PianoStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  const {
    self,
    participants,
    activeKeyColors,
    ribbons,
    sustainDown,
    pressNote,
    releaseNote,
    pressSustain,
  } = usePianoSession();

  const cursors = useSharedCursors(stageRef);

  const [baseOctave, setBaseOctave] = useState(DEFAULT_BASE_OCTAVE);
  const [showLabels, setShowLabels] = useState(true);
  const [volume, setVolume] = useState(() => getMasterVolume());
  const [progress, setProgress] = useState<LoadProgress>({
    loaded: 0,
    total: 0,
  });

  useEffect(() => onLoadProgress(setProgress), []);

  const isLoading = progress.total > 0 && progress.loaded < progress.total;

  return (
    <section
      ref={stageRef}
      className='stage-light relative flex h-full w-full min-w-0 flex-col'
    >
      <RoomBar
        participants={participants}
        selfId={self?.id ?? null}
        loadedSamples={progress.loaded}
        totalSamples={progress.total}
      />

      {/* 건반 영역. 좁은 화면에서는 가로 스크롤로 88건반을 유지합니다. */}
      <div className='flex min-h-0 flex-1 items-end overflow-x-auto overflow-y-hidden'>
        <div
          className='flex w-full flex-col justify-end'
          style={{ minWidth: `${MIN_KEYBOARD_WIDTH_PX}px` }}
        >
          {/* 리본이 자라 올라가는 통로. 건반과 같은 폭이라 좌표가 맞습니다. */}
          <div className='relative h-56 shrink-0 sm:h-64'>
            <NoteRibbons ribbons={ribbons} />
          </div>

          <div className='piano-deck shrink-0 pt-1.5'>
            <div className='relative h-40 sm:h-48 lg:h-56'>
              <PianoKeyboard
                activeKeyColors={activeKeyColors}
                baseOctave={baseOctave}
                showLabels={showLabels}
                onBaseOctaveChange={setBaseOctave}
                onPressNote={pressNote}
                onReleaseNote={releaseNote}
                onSustain={pressSustain}
              />
            </div>
          </div>
        </div>
      </div>

      <StageToolbar
        baseOctave={baseOctave}
        onBaseOctaveChange={setBaseOctave}
        showLabels={showLabels}
        onShowLabelsChange={setShowLabels}
        volume={volume}
        onVolumeChange={(next) => {
          setVolume(next);
          setMasterVolume(next);
        }}
        sustainDown={sustainDown}
        isLoading={isLoading}
      />

      <SharedCursors
        cursors={cursors}
        participants={participants}
        selfId={self?.id ?? null}
      />
    </section>
  );
}

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

function StageToolbar({
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
    <div className='border-line bg-surface/80 flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-t px-4 py-3 text-xs backdrop-blur'>
      <div className='flex items-center gap-2'>
        <span className='text-ink-faint'>옥타브</span>
        <div className='border-line flex items-center overflow-hidden rounded-md border'>
          <button
            type='button'
            aria-label='기준 옥타브 낮추기'
            disabled={baseOctave <= MIN_BASE_OCTAVE}
            onClick={() => onBaseOctaveChange(baseOctave - 1)}
            className='text-ink-muted hover:bg-raised hover:text-ink px-2.5 py-1 transition-colors disabled:opacity-30'
          >
            −
          </button>
          <span className='border-line text-ink min-w-10 border-x px-2 py-1 text-center font-mono font-semibold'>
            C{baseOctave}
          </span>
          <button
            type='button'
            aria-label='기준 옥타브 올리기'
            disabled={baseOctave >= MAX_BASE_OCTAVE}
            onClick={() => onBaseOctaveChange(baseOctave + 1)}
            className='text-ink-muted hover:bg-raised hover:text-ink px-2.5 py-1 transition-colors disabled:opacity-30'
          >
            +
          </button>
        </div>
      </div>

      <label className='text-ink-muted flex cursor-pointer items-center gap-2'>
        <input
          type='checkbox'
          checked={showLabels}
          onChange={(event) => onShowLabelsChange(event.target.checked)}
          className='accent-accent size-3.5'
        />
        키 안내
      </label>

      <label className='text-ink-muted flex items-center gap-2'>
        <span className='text-ink-faint'>볼륨</span>
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          value={volume}
          aria-label='볼륨'
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className='accent-accent w-24'
        />
      </label>

      <span
        className={`rounded-full border px-2 py-0.5 font-medium transition-colors ${
          sustainDown
            ? 'border-accent bg-accent/15 text-accent-hot'
            : 'border-line text-ink-faint'
        }`}
      >
        서스테인 · Space
      </span>

      {isLoading && (
        <span className='text-ink-faint ml-auto'>사운드 준비 중…</span>
      )}
    </div>
  );
}
