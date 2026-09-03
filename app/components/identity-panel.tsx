'use client';

import { useState, type KeyboardEvent } from 'react';

import { Field, Input } from '@/app/components/ui/field';
import { useIdentity } from '@/app/hooks/use-identity';
import { MAX_NAME_LENGTH, setIdentity } from '@/app/lib/identity';
import { PARTICIPANT_COLORS } from '@/shared/participant-colors';

/**
 * 닉네임과 색을 고르는 패널.
 *
 * 로그인과 무관하게 누구나 바꿀 수 있습니다. 입력 중에 한 글자마다 서버로
 * 보내면 방 전체가 매 타이핑마다 명단을 다시 받으므로, 확정(Enter · 포커스 해제)
 * 시점에만 저장합니다. 색은 팔레트에서만 고를 수 있어 서버 검증과 어긋나지 않습니다.
 */
export default function IdentityPanel() {
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

  return (
    <div className='flex flex-col gap-4'>
      <Field label='닉네임'>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          maxLength={MAX_NAME_LENGTH}
          placeholder='표시할 이름'
          aria-label='닉네임'
        />
      </Field>

      <fieldset className='flex flex-col gap-2'>
        <legend className='text-ink-muted text-xs font-medium'>내 색</legend>
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
              {/*
                선택 표시는 바깥 링이 아니라 테두리로 만듭니다. 링은 스와치가
                차지하는 자리를 넓혀 옆 항목을 밀어내지만, 테두리는 고정입니다.
              */}
              <span
                aria-hidden='true'
                className='border-line hover:border-line-strong peer-checked:border-ink peer-focus-visible:border-ink grid size-7 place-items-center rounded-full border-2 transition-colors'
              >
                <span
                  className='size-4 rounded-full'
                  style={{ backgroundColor: color }}
                />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
