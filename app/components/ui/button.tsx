import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/app/lib/cn';

/**
 * 버튼 스타일 정의.
 *
 * 페이지마다 `rounded-lg px-5 py-2.5 text-sm font-semibold …` 를 다시 적으면
 * 화면마다 높이와 자간이 조금씩 달라지고, 나중에 한 곳만 고치게 됩니다.
 * 변형(variant)과 크기(size)를 여기 한 번만 정의하고 나머지는 골라 씁니다.
 *
 * `primary` 가 흰 바탕인 이유는 `globals.css` 의 토큰 주석에 있습니다.
 * 채도는 참가자 구분에만 쓰므로, 강조는 대비로 만듭니다.
 */
const buttonStyles = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md',
    'font-medium whitespace-nowrap',
    'transition-[background-color,border-color,color,opacity] duration-150',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-ink hover:bg-accent-hover font-semibold',
        secondary:
          'border border-line bg-raised text-ink hover:border-line-strong hover:bg-overlay',
        ghost: 'text-ink-muted hover:bg-raised hover:text-ink',
        danger:
          'border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export type ButtonVariants = VariantProps<typeof buttonStyles>;

type ButtonProps = ComponentProps<'button'> & ButtonVariants;

export function Button({
  variant,
  size,
  block,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      // 폼 안에서 실수로 제출되지 않게 기본값을 `button` 으로 둡니다.
      type={type}
      className={cn(buttonStyles({ variant, size, block }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonVariants;

/** 이동은 링크여야 합니다. 버튼에 `router.push` 를 붙이면 새 탭 열기가 막힙니다. */
export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonStyles({ variant, size, block }), className)}
      {...props}
    />
  );
}

interface IconOnlyProps {
  /** 아이콘만 있으므로 이름은 필수입니다. */
  label: string;
  icon: ReactNode;
  variant?: ButtonVariants['variant'];
  size?: 'sm' | 'md';
}

/** 정사각형으로 만드는 공통 클래스 */
function squareClasses(size: 'sm' | 'md'): string {
  return cn('aspect-square p-0', size === 'sm' ? 'w-8' : 'w-10');
}

type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  IconOnlyProps;

/** 정사각형 아이콘 버튼. 텍스트가 없으니 `aria-label` 을 강제합니다. */
export function IconButton({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        buttonStyles({ variant, size }),
        squareClasses(size),
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

type IconLinkProps = Omit<ComponentProps<typeof Link>, 'children'> &
  IconOnlyProps;

/**
 * 아이콘만 있는 링크.
 *
 * 이동에 `onClick` + `location.assign` 을 쓰면 전체 페이지가 다시 로드되어
 * 클라이언트 내비게이션과 소켓 연결이 통째로 끊깁니다. 새 탭으로 열기도
 * 막힙니다. 이동은 항상 `Link` 여야 합니다.
 */
export function IconButtonLink({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  className,
  ...props
}: IconLinkProps) {
  return (
    <Link
      aria-label={label}
      className={cn(
        buttonStyles({ variant, size }),
        squareClasses(size),
        // `.rail-link` 이 있어야 `.rail-tip` 이 hover·focus 에 반응합니다.
        'rail-link',
        className,
      )}
      {...props}
    >
      {icon}
      <span className='rail-tip'>{label}</span>
    </Link>
  );
}
