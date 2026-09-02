import { BiSolidPiano } from 'react-icons/bi';
import { FaHouse } from 'react-icons/fa6';
import { GiGrandPiano } from 'react-icons/gi';
import { MdContactEmergency } from 'react-icons/md';
import { RiAccountBoxFill } from 'react-icons/ri';

import SidebarItem, { type NavItem } from '@/app/components/sidebar-item';

const PRIMARY_ITEMS: NavItem[] = [
  { title: 'Home', href: '/', icon: <FaHouse /> },
  { title: 'Piano', href: '/piano', icon: <BiSolidPiano /> },
  { title: 'Contact', href: '/contact', icon: <MdContactEmergency /> },
];

const ACCOUNT_ITEM: NavItem = {
  title: 'Account',
  href: '/profile',
  icon: <RiAccountBoxFill />,
};

/**
 * 펼침/접힘을 CSS 만으로 처리하는 서버 컴포넌트입니다.
 *
 * 이전에는 `onMouseEnter`/`onMouseLeave` + `useState` 로 폭을 바꿨는데,
 * 그러면 키보드 사용자는 펼칠 수 없고 컴포넌트 전체가 클라이언트 번들에 들어갑니다.
 * `group-hover` 와 `group-focus-within` 을 쓰면 마우스와 키보드 모두 동작하고
 * 상태도 필요하지 않습니다.
 */
export default function Sidebar() {
  return (
    <nav
      aria-label='주 메뉴'
      className='group bg-sub2 relative z-50 flex h-screen w-20 max-w-72 shrink-0 flex-col p-5 pt-8 duration-300 select-none focus-within:w-72 hover:w-72'
    >
      <div className='inline-flex items-center'>
        <GiGrandPiano className='mr-2 shrink-0 rounded-sm bg-white text-4xl text-black duration-500 group-hover:rotate-360' />
        <h1 className='hidden text-xl font-black whitespace-nowrap text-white group-focus-within:block group-hover:block'>
          Together
        </h1>
      </div>

      <div className='flex grow flex-col justify-between'>
        <ul className='pt-2'>
          {PRIMARY_ITEMS.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </ul>

        <ul className='pt-2'>
          <SidebarItem {...ACCOUNT_ITEM} />
        </ul>
      </div>
    </nav>
  );
}
