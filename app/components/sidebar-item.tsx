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
 * 사이드바가 접혀 있을 때는 아이콘만 보이므로 이름은 항상 `aria-label` 로 제공하고,
 * 마우스에는 툴팁으로 보여 줍니다.
 *
 * 현재 위치는 `aria-current="page"` 로 알리고 강조 스타일도 그 속성에 걸어,
 * 화면과 스크린리더가 같은 정보를 쓰게 합니다. 펼침 여부는 부모의 `group`
 * 상태에 따라 CSS 로만 결정되므로 JS 상태가 필요하지 않습니다.
 */
export default function SidebarItem({ title, href, icon }: NavItem) {
  const pathname = usePathname();
  const isCurrent = pathname === href;

  return (
    <li>
      <Link
        href={href}
        aria-label={title}
        aria-current={isCurrent ? 'page' : undefined}
        title={title}
        className='group/item text-ink-muted hover:bg-raised hover:text-ink aria-[current=page]:bg-raised aria-[current=page]:text-ink relative flex h-11 items-center gap-3 rounded-lg px-3 transition-colors'
      >
        {/* 현재 페이지 표시선 */}
        <span
          aria-hidden='true'
          className={`bg-accent absolute left-0 h-5 w-0.5 rounded-r-full transition-opacity ${
            isCurrent ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <span className='grid size-5 shrink-0 place-items-center text-lg'>
          {icon}
        </span>
        <span className='hidden text-sm font-medium whitespace-nowrap group-focus-within:inline group-hover:inline'>
          {title}
        </span>
      </Link>
    </li>
  );
}
