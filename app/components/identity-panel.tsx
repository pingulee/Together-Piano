'use client';

import { useState, type KeyboardEvent } from 'react';

import { useIdentity } from '@/app/hooks/use-identity';
import { MAX_NAME_LENGTH, setIdentity } from '@/app/lib/identity';
import { PARTICIPANT_COLORS } from '@/shared/participant-colors';

interface IdentityPanelProps {
  /** `compact` 는 연주실 하단 툴바용, `full` 은 로비용입니다. */
  variant?: 'compact' | 'full';
}

/**
 * 닉네임과 색을 고르는 패널.
 *
 * 로그인과 무관하게 누구나 바꿀 수 있습니다. 입력 중에 한 글자마다 서버로
 * 보내면 방 전체가 매 타이핑마다 명단을 다시 받으므로, 확정(Enter · 포커스 해제)
 * 시점에만 저장합니다. 색은 팔레트에서만 고를 수 있어 서버 검증과 어긋나지 않습니다.
 */
export default function IdentityPanel({
  variant = 'full',
}: IdentityPanelProps) {
  const identity = useIdentity();

  const [draft, setDraft] = useState(identity.name);

  /**
   * 저장된 이름이 바깥에서 바뀌면(다른 탭, 로그인 이름 자동 채움) 입력창도 맞춥니다.
   *
   * 이펙트로 하면 저장된 값이 바뀔 때마다 렌더가 한 번 더 돌고, 그 사이 한 프레임은
   * 옛 값이 보입니다. 렌더 중에 비교해 바로 맞추는 것이 React 가 권하는 방식입니다.
   */
  const [syncedName, setSyncedName] = useState(identity.name);
  if (syncedName !== identity.name) {
    setSyncedName(identity.name);
    setDraft(identity.name);
  }

  const commit = () => {
    const next = draft.trim();
    // 비운 채 확정하면 원래 이름으로 되돌립니다. 이름 없는 참가자는 없습니다.
    if (!next) {
      setDraft(identity.name);
      return;
    }
    setIdentity({ name: next });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
      return;
    }
    if (event.key === 'Escape') {
      setDraft(identity.name);
      event.currentTarget.blur();
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div
      className={isCompact ? 'flex flex-col gap-2.5' : 'flex flex-col gap-4'}
    >
      <label className='flex flex-col gap-1.5'>
        <span className='text-ink-faint text-xs'>닉네임</span>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          maxLength={MAX_NAME_LENGTH}
          placeholder='표시할 이름'
          aria-label='닉네임'
          className='border-line bg-raised focus:border-accent placeholder:text-ink-faint rounded-lg border px-3 py-2 text-sm transition-colors outline-none'
        />
      </label>

      <fieldset className='flex flex-col gap-1.5'>
        <legend className='text-ink-faint text-xs'>내 색</legend>
        <div className='flex flex-wrap gap-1.5'>
          {PARTICIPANT_COLORS.map((color) => (
            <label
              key={color}
              className='cursor-pointer'
              // 스와치만 보이므로 접근성 이름을 붙여 줍니다.
              aria-label={`색 ${color}`}
            >
              <input
                type='radio'
                name='participant-color'
                value={color}
                checked={color === identity.color}
                onChange={() => setIdentity({ color })}
                className='peer sr-only'
              />
              <span
                aria-hidden='true'
                style={{ backgroundColor: color }}
                className='ring-ink peer-checked:ring-offset-surface block size-6 rounded-full transition-transform peer-checked:scale-110 peer-checked:ring-2 peer-checked:ring-offset-2 peer-focus-visible:ring-2 hover:scale-110'
              />
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
