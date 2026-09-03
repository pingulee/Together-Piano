'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
}

/**
 * 레일 항목 하나.
 *
 * 아이콘만 보이므로 이름은 `aria-label` 과 툴팁으로 함께 제공합니다.
 * 현재 위치는 `aria-current="page"` 로 알리고 강조 스타일도 그 속성에 걸어,
 * 화면과 스크린리더가 같은 정보를 쓰게 합니다.
 */
export default function SidebarItem({ title, href, icon }: NavItem) {
  const pathname = usePathname();

  // 연주실은 `/piano/방이름` 으로도 들어가므로 하위 경로까지 현재로 봅니다.
  const isCurrent =
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <li className='relative'>
      <Link
        href={href}
        aria-label={title}
        aria-current={isCurrent ? 'page' : undefined}
        className='rail-link text-ink-faint hover:bg-raised hover:text-ink aria-[current=page]:text-ink relative grid size-10 place-items-center rounded-md text-lg transition-colors'
      >
        {icon}
        <span className='rail-tip'>{title}</span>
      </Link>

      {/* 현재 페이지 표시선. 링크 밖에 둬 hover 배경에 가려지지 않게 합니다. */}
      {isCurrent && (
        <span
          aria-hidden='true'
          className='bg-accent absolute top-1/2 -left-3 h-5 w-0.5 -translate-y-1/2 rounded-r-full'
        />
      )}
    </li>
  );
}
