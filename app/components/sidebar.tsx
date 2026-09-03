import Link from 'next/link';
import { BiSolidPiano } from 'react-icons/bi';
import { FaHouse } from 'react-icons/fa6';
import { GiGrandPiano } from 'react-icons/gi';
import { MdContactEmergency } from 'react-icons/md';
import { RiAccountBoxFill } from 'react-icons/ri';

import SidebarItem, { type NavItem } from '@/app/components/sidebar-item';

const PRIMARY_ITEMS: NavItem[] = [
  { title: '홈', href: '/', icon: <FaHouse /> },
  { title: '연주실', href: '/piano', icon: <BiSolidPiano /> },
  { title: '만든 사람', href: '/contact', icon: <MdContactEmergency /> },
];

const ACCOUNT_ITEM: NavItem = {
  title: '내 계정',
  href: '/profile',
  icon: <RiAccountBoxFill />,
};

/**
 * 펼침/접힘을 CSS 만으로 처리하는 서버 컴포넌트입니다.
 *
 * 이전에는 `onMouseEnter`/`onMouseLeave` + `useState` 로 폭을 바꿨는데, 그러면
 * 키보드 사용자는 펼칠 수 없고 컴포넌트 전체가 클라이언트 번들에 들어갑니다.
 * `group-hover` 와 `group-focus-within` 을 쓰면 마우스와 키보드 모두 동작하고
 * 상태도 필요하지 않습니다.
 */
export default function Sidebar() {
  return (
    <nav
      aria-label='주 메뉴'
      className='group border-line bg-surface z-40 flex h-screen w-16 shrink-0 flex-col gap-6 border-r p-3 transition-[width] duration-300 ease-out focus-within:w-56 hover:w-56'
    >
      <Link
        href='/'
        aria-label='Together Piano 홈'
        className='hover:bg-raised flex h-10 items-center gap-3 rounded-lg px-1.5 transition-colors'
      >
        <GiGrandPiano className='text-accent shrink-0 text-2xl' />
        <span className='hidden text-base font-bold tracking-tight whitespace-nowrap group-focus-within:inline group-hover:inline'>
          Together
        </span>
      </Link>

      <ul className='flex flex-1 flex-col gap-1'>
        {PRIMARY_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </ul>

      <ul>
        <SidebarItem {...ACCOUNT_ITEM} />
      </ul>
    </nav>
  );
}
