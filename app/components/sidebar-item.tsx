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
 * 사이드바가 접혀 있을 때는 아이콘만 보이므로 이름은 항상 `aria-label` 로 제공합니다.
 * 현재 위치는 `aria-current="page"` 로 알리고, 강조 스타일도 그 속성에 걸어
 * 화면과 스크린리더가 같은 정보를 쓰게 합니다.
 * 펼침 여부는 부모의 `group` 상태에 따라 CSS 로만 결정됩니다.
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
        className='aria-[current=page]:border-highlight aria-[current=page]:bg-sub1 my-4 flex items-center gap-x-4 rounded-md p-2 text-sm transition duration-300 ease-in-out hover:bg-white hover:text-black aria-[current=page]:border-l-4'
      >
        <span className='shrink-0 text-2xl'>{icon}</span>
        <span className='hidden flex-1 text-base font-semibold whitespace-nowrap group-focus-within:inline group-hover:inline'>
          {title}
        </span>
      </Link>
    </li>
  );
}
