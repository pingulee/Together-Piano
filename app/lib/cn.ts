import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 클래스 이름을 합칩니다.
 *
 * 템플릿 문자열로 이어 붙이면 나중에 온 클래스가 이긴다는 보장이 없습니다.
 * Tailwind 는 CSS 파일 안의 순서로 우선순위가 정해지므로, `px-4` 를 쓰는
 * 컴포넌트에 `px-6` 을 넘겨도 둘 중 뭐가 적용될지는 알 수 없습니다.
 * `twMerge` 는 같은 속성군끼리 뒤에 온 것만 남겨 이 문제를 없앱니다.
 * 프리미티브가 `className` 을 받을 수 있는 근거가 이것입니다.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
