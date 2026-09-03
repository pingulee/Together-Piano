import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/app/lib/cn';

/**
 * 텍스트 입력.
 *
 * 높이·반경·포커스 표현을 한 곳에 둡니다. 화면마다 다시 적으면 같은 폼 안에서도
 * 입력창 높이가 어긋납니다.
 */
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'border-line bg-raised text-ink placeholder:text-ink-faint',
        'h-10 w-full min-w-0 rounded-md border px-3 text-sm',
        'transition-colors outline-none',
        'hover:border-line-strong focus:border-ink-faint',
        className,
      )}
      {...props}
    />
  );
}

interface FieldProps {
  label: string;
  /** 라벨 아래 보조 설명 */
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * 라벨 + 컨트롤 + 설명 묶음.
 *
 * `label` 로 감싸므로 설명을 눌러도 컨트롤로 포커스가 갑니다. `htmlFor` 와 `id`
 * 를 짝지어 관리하면 컴포넌트마다 고유 id 를 만들어야 하고, 빠뜨리면 라벨이
 * 아무것도 가리키지 않게 됩니다.
 */
export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className='text-ink-muted text-xs font-medium'>{label}</span>
      {children}
      {hint && <span className='text-ink-faint text-2xs'>{hint}</span>}
    </label>
  );
}

interface SwitchProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string;
}

/**
 * 켜기·끄기 토글.
 *
 * 기본 체크박스는 브라우저마다 크기와 색이 다르고 어두운 배경에서 튑니다.
 * 실제 `input` 은 남겨 두고(키보드·스크린리더·폼 동작이 그대로 필요합니다)
 * 시각 표현만 형제 요소에 `peer-checked` 로 얹습니다.
 */
export function Switch({ label, className, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        'group text-ink-muted hover:text-ink flex cursor-pointer items-center gap-2 text-xs transition-colors',
        className,
      )}
    >
      <input type='checkbox' className='peer sr-only' {...props} />
      <span
        aria-hidden='true'
        className={cn(
          'border-line bg-raised relative h-4 w-7 shrink-0 rounded-full border',
          'transition-colors duration-150',
          'peer-checked:border-accent peer-checked:bg-accent',
          'peer-focus-visible:outline-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
          // 손잡이
          'after:bg-ink-muted after:absolute after:top-1/2 after:left-0.5 after:size-2.5 after:-translate-y-1/2 after:rounded-full',
          'after:transition-transform after:duration-150',
          'peer-checked:after:bg-accent-ink peer-checked:after:translate-x-3',
        )}
      />
      {label}
    </label>
  );
}

interface SliderProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string;
}

/**
 * 값 슬라이더.
 *
 * 네이티브 `range` 의 트랙·손잡이는 벤더 접두사로만 손볼 수 있어 Tailwind
 * 유틸리티로는 닿지 않습니다. `accent-color` 만 지정하고 나머지는 브라우저에
 * 맡기는 편이 각 플랫폼의 조작감과 접근성을 그대로 살립니다.
 */
export function Slider({ label, className, ...props }: SliderProps) {
  return (
    <label className='text-ink-muted flex items-center gap-2 text-xs'>
      <span className='text-ink-faint'>{label}</span>
      <input
        type='range'
        aria-label={label}
        className={cn('accent-accent h-1 w-24 cursor-pointer', className)}
        {...props}
      />
    </label>
  );
}
