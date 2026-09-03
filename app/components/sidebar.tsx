import Link from 'next/link';
import { BiSolidPiano } from 'react-icons/bi';
import { FaHouse } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';
import { RiAccountCircleLine } from 'react-icons/ri';

import SidebarItem, { type NavItem } from '@/app/components/sidebar-item';

const PRIMARY_ITEMS: NavItem[] = [
  { title: '홈', href: '/', icon: <FaHouse /> },
  { title: '연주실', href: '/piano', icon: <BiSolidPiano /> },
  { title: '만든 사람', href: '/contact', icon: <HiOutlineMail /> },
];

const ACCOUNT_ITEM: NavItem = {
  title: '내 계정',
  href: '/profile',
  icon: <RiAccountCircleLine />,
};

/**
 * 아이콘 레일.
 *
 * 폭이 고정입니다. 예전에는 hover 로 펼쳐 이름을 보여 줬는데 그때마다 본문이
 * 밀려 연주 중에 건반 위치가 흔들렸고, 키보드로는 펼칠 수 없어 이름을 볼 방법이
 * 없었습니다. 이름은 흐름 밖에 뜨는 툴팁(`.rail-tip`)이 맡고, hover 와
 * `:focus-visible` 양쪽에 걸려 있습니다. 상태가 없으므로 서버 컴포넌트입니다.
 */
export default function Sidebar() {
  return (
    <nav
      aria-label='주 메뉴'
      className='border-line bg-surface z-40 flex h-screen w-14 shrink-0 flex-col items-center gap-4 border-r py-3'
    >
      <Link
        href='/'
        aria-label='Together Piano 홈'
        className='rail-link relative grid size-10 shrink-0 place-items-center'
      >
        <span
          aria-hidden='true'
          className='border-line-strong bg-raised text-ink grid size-8 place-items-center rounded-md border text-sm font-bold'
        >
          T
        </span>
        <span className='rail-tip'>Together Piano</span>
      </Link>

      <ul className='flex flex-1 flex-col items-center gap-1'>
        {PRIMARY_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </ul>

      <ul className='flex flex-col items-center'>
        <SidebarItem {...ACCOUNT_ITEM} />
      </ul>
    </nav>
  );
}
