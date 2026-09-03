import { FaCrown } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';

import { cn } from '@/app/lib/cn';
import type { Participant } from '@/shared/socket-events';

interface ParticipantChipProps {
  participant: Participant;
  isSelf: boolean;
  /** 넘기면 강퇴 버튼이 붙습니다. 방장에게만 넘기세요. */
  onKick?: (targetId: string) => void;
}

/**
 * 참가자 한 명의 표시.
 *
 * 색 점 · 방장 표시 · 이름 · 강퇴로 이루어진 조합이 상단 바와 로비 양쪽에
 * 필요합니다. 각자 짜면 같은 사람이 화면마다 다르게 보입니다.
 */
export default function ParticipantChip({
  participant,
  isSelf,
  onKick,
}: ParticipantChipProps) {
  return (
    <span
      className={cn(
        'flex max-w-44 items-center gap-1.5 rounded-full border py-0.5 pr-2 pl-1.5 text-xs',
        // 자기 자신은 경계를 밝게 해 명단에서 바로 찾을 수 있게 합니다.
        isSelf
          ? 'border-line-strong bg-raised'
          : 'border-line bg-surface text-ink-muted',
      )}
    >
      <span
        className='size-2 shrink-0 rounded-full'
        style={{ backgroundColor: participant.color }}
        aria-hidden='true'
      />

      {participant.isHost && (
        <FaCrown
          className='text-2xs shrink-0 text-amber-400'
          aria-label='방장'
        />
      )}

      <span className='truncate'>{participant.name}</span>

      {isSelf && <span className='text-ink-faint text-2xs shrink-0'>나</span>}

      {onKick && !isSelf && (
        <button
          type='button'
          aria-label={`${participant.name} 내보내기`}
          onClick={() => onKick(participant.id)}
          className='text-ink-faint hover:text-danger -mr-1 shrink-0 rounded-full p-0.5 transition-colors'
        >
          <IoClose />
        </button>
      )}
    </span>
  );
}
