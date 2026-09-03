import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/app/lib/cn';

const badgeStyles = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-line text-ink-faint',
        strong: 'border-line-strong bg-raised text-ink-muted',
        live: 'border-live/30 bg-live/10 text-live',
        active: 'border-accent/40 bg-accent/10 text-ink',
      },
      size: {
        sm: 'px-2 py-0.5 text-2xs',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
);

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeStyles>;

/** 상태·수치를 한 단어로 보여 주는 칩 */
export function Badge({ tone, size, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ tone, size }), className)} {...props} />
  );
}

/** 살아 있는 연결을 알리는 점. 자체적으로 깜빡여 상태가 정적이지 않음을 보입니다. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden='true'
      className={cn(
        'bg-live size-1.5 shrink-0 rounded-full',
        'motion-safe:animate-pulse',
        className,
      )}
    />
  );
}
