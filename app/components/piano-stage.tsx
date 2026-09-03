'use client';

import { useEffect, useRef, useState } from 'react';

import ExitNotice from '@/app/components/exit-notice';
import NoteRibbons from '@/app/components/note-ribbons';
import PianoKeyboard from '@/app/components/piano-keyboard';
import RoomBar from '@/app/components/room-bar';
import SharedCursors from '@/app/components/shared-cursors';
import StageToolbar from '@/app/components/stage-toolbar';
import { usePianoSession } from '@/app/hooks/use-piano-session';
import { useSharedCursors } from '@/app/hooks/use-shared-cursors';
import {
  getMasterVolume,
  onLoadProgress,
  setMasterVolume,
  type LoadProgress,
} from '@/app/lib/audio';
import { DEFAULT_BASE_OCTAVE } from '@/app/lib/keyboard-map';

/** 88건반을 알아볼 수 있는 최소 폭. 이보다 좁으면 가로로 스크롤합니다. */
const MIN_KEYBOARD_WIDTH_PX = 960;

interface PianoStageProps {
  roomId: string;
}

/**
 * 연주실 화면.
 *
 * 위에서 아래로 상단 바 · 리본 통로 · 건반 · 설정 줄 순서로 쌓고, 커서
 * 오버레이만 전체에 겹칩니다. 리본 통로가 남는 높이를 전부 가져가므로
 * 창을 키우면 띠가 더 길게 올라갑니다.
 */
export default function PianoStage({ roomId }: PianoStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  const {
    self,
    participants,
    room,
    isSelfHost,
    exitReason,
    activeKeyColors,
    ribbons,
    sustainDown,
    pressNote,
    releaseNote,
    pressSustain,
    kick,
    setLocked,
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

  if (exitReason) return <ExitNotice reason={exitReason} />;

  return (
    <section
      ref={stageRef}
      className='stage-light relative flex h-full w-full min-w-0 flex-col'
    >
      <RoomBar
        roomId={roomId}
        participants={participants}
        selfId={self?.id ?? null}
        isSelfHost={isSelfHost}
        locked={room?.locked ?? false}
        onKick={kick}
        onToggleLock={setLocked}
        loadedSamples={progress.loaded}
        totalSamples={progress.total}
      />

      {/* 건반 영역. 좁은 화면에서는 가로 스크롤로 88건반을 유지합니다. */}
      <div className='min-h-0 flex-1 overflow-x-auto overflow-y-hidden'>
        <div
          className='flex h-full w-full flex-col'
          style={{ minWidth: `${MIN_KEYBOARD_WIDTH_PX}px` }}
        >
          <div className='relative min-h-24 flex-1'>
            <NoteRibbons ribbons={ribbons} />
          </div>

          <div className='piano-deck shrink-0 pt-1.5'>
            <div className='relative h-40 sm:h-44 lg:h-52'>
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
        isLoading={progress.total > 0 && progress.loaded < progress.total}
      />

      <SharedCursors
        cursors={cursors}
        participants={participants}
        selfId={self?.id ?? null}
      />
    </section>
  );
}
