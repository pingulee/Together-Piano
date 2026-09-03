import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ElementType, ReactNode } from 'react';

import { cn } from '@/app/lib/cn';

const panelStyles = cva('rounded-lg border', {
  variants: {
    tone: {
      /** 배경 위에 얹힌 카드 */
      raised: 'border-line bg-surface',
      /** 떠 있는 층. 팝오버·모달 */
      overlay: 'border-line bg-overlay shadow-pop',
      /** 아직 아무것도 없는 자리 */
      empty: 'border-line border-dashed bg-transparent',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
    interactive: {
      true: 'hover:border-line-strong transition-colors',
    },
  },
  defaultVariants: { tone: 'raised', padding: 'md' },
});

type PanelProps = ComponentProps<'div'> &
  VariantProps<typeof panelStyles> & {
    /** `section`, `article` 등 의미에 맞는 태그로 바꿉니다. */
    as?: ElementType;
  };

/** 카드·팝오버의 공통 면. 배경·경계·반경을 여기서만 정합니다. */
export function Panel({
  as: Tag = 'div',
  tone,
  padding,
  interactive,
  className,
  ...props
}: PanelProps) {
  return (
    <Tag
      className={cn(panelStyles({ tone, padding, interactive }), className)}
      {...props}
    />
  );
}

interface SectionHeadingProps {
  title: string;
  description?: string;
  /** 제목 오른쪽에 놓을 요소 (개수 표시, 버튼 등) */
  action?: ReactNode;
  /** 문서 구조에 맞는 단계를 고릅니다. 크기는 이 값과 무관하게 같습니다. */
  level?: 'h2' | 'h3';
}

/**
 * 구역 제목.
 *
 * 제목 크기와 설명 간격을 통일합니다. 화면마다 다르게 적으면 같은 위계의
 * 제목이 서로 다른 크기로 나옵니다.
 */
export function SectionHeading({
  title,
  description,
  action,
  level: Tag = 'h2',
}: SectionHeadingProps) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex min-w-0 flex-col gap-1'>
        <Tag className='text-base font-semibold'>{title}</Tag>
        {description && <p className='text-ink-faint text-xs'>{description}</p>}
      </div>
      {action}
    </div>
  );
}
