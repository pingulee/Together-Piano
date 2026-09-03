import { BiSolidPiano } from 'react-icons/bi';

import KoreaClock from '@/app/components/korea-clock';
import { ButtonLink } from '@/app/components/ui/button';
import { LiveDot } from '@/app/components/ui/badge';
import { PARTICIPANT_COLORS } from '@/shared/participant-colors';
import { WHITE_KEYS } from '@/app/lib/notes';

/**
 * 한 줄로 읽히는 특징.
 *
 * 카드 그리드로 늘어놓지 않습니다. 아이콘 붙인 카드 네 장은 어느 서비스에나
 * 있는 배치라 이 사이트가 무엇인지 말해 주지 않고, 정작 주인공인 건반을
 * 화면 밖으로 밀어냅니다.
 */
const FACTS = [
  ['88건반', '실제 피아노와 같은 A0-C8'],
  ['연주자별 색', '누른 음이 그 사람 색 띠로 올라갑니다'],
  ['커서 공유', '서로 어디를 짚을지 눈으로 맞춥니다'],
  ['키보드 · MIDI', '자판으로 바로, 건반을 꽂으면 세기까지'],
] as const;

/** 히어로 아래에 놓는 장식용 건반. 실제 흰건반 수만큼 그려 비율을 맞춥니다. */
function KeyboardSilhouette() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden'
    >
      {/* 위쪽으로 서서히 사라지게 해 본문과 겹치는 경계를 없앱니다. */}
      <div className='absolute inset-x-0 bottom-0 h-full mask-[linear-gradient(to_top,#000_10%,transparent_85%)]'>
        <div className='piano-deck absolute inset-x-0 bottom-0 h-32 pt-1.5'>
          <div className='relative flex h-full w-full'>
            {WHITE_KEYS.map((key, index) => {
              // 몇 개만 연주자 색으로 켜 둬 무엇을 하는 곳인지 보이게 합니다.
              const isLit = index % 17 === 4;

              return (
                <div
                  key={key.note}
                  className='piano-key-white relative flex-1'
                  data-active={isLit}
                  style={
                    isLit
                      ? {
                          ['--key-color' as string]:
                            PARTICIPANT_COLORS[
                              index % PARTICIPANT_COLORS.length
                            ],
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className='stage-light relative flex-1 overflow-hidden'>
      <div className='grid-veil absolute inset-0' aria-hidden='true' />
      <KeyboardSilhouette />

      <div className='relative flex h-full flex-col justify-center px-8 pb-40 sm:px-14'>
        <div className='flex max-w-2xl flex-col items-start gap-7'>
          <span className='border-line bg-surface/70 text-ink-muted text-2xs inline-flex items-center gap-2 rounded-full border px-2.5 py-1 backdrop-blur'>
            <LiveDot />
            실시간 합주
          </span>

          <h1 className='text-4xl font-bold text-balance sm:text-5xl'>
            떨어져 있어도
            <br />
            같은 피아노를 칩니다
          </h1>

          <p className='text-ink-muted max-w-md text-base'>
            브라우저만 있으면 됩니다. 방 이름을 적어 들어가고, 링크를 보내면
            그대로 합주가 됩니다.
          </p>

          <div className='flex flex-wrap items-center gap-2'>
            <ButtonLink href='/piano' variant='primary' size='lg'>
              <BiSolidPiano className='text-lg' />
              연주실 입장
            </ButtonLink>
            <ButtonLink href='/login' variant='ghost' size='lg'>
              로그인 (선택)
            </ButtonLink>
          </div>

          <dl className='border-line mt-2 grid gap-x-10 gap-y-4 border-t pt-6 sm:grid-cols-2'>
            {FACTS.map(([term, detail]) => (
              <div key={term} className='flex flex-col gap-0.5'>
                <dt className='text-sm font-semibold'>{term}</dt>
                <dd className='text-ink-faint text-xs'>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <footer className='border-line bg-canvas/60 absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-4 border-t px-8 py-3 backdrop-blur sm:px-14'>
        <KoreaClock />
        <p className='text-ink-faint text-2xs'>
          같은 지역에서는 왕복 10-30ms 로 합이 맞습니다
        </p>
      </footer>
    </div>
  );
}
