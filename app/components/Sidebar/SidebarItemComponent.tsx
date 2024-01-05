// SidebarItemComponent.tsx

// 넥스트
import Link from 'next/link';
import { useRouter } from 'next/router';

// 인터페이스
import { SidebarItemTitleProp } from '@/interfaces/Sidebar/SidebarItem/SidebarItemTitleProp';
import { SidebarItemHrefProp } from '@/interfaces/Sidebar/SidebarItem/SidebarItemHrefProp';
import { SidebarItemIconProp } from '@/interfaces/Sidebar/SidebarItem/SidebarItemIconProp';
import { OpenProp } from '@/app/interfaces/OpenProp';
interface SidebarItemProps
  extends SidebarItemTitleProp,
    SidebarItemHrefProp,
    SidebarItemIconProp,
    OpenProp {}

export default function SidebarItemComponent({
  title,
  href,
  icon,
  open,
}: SidebarItemProps) {
  return (
    <Link href={href}>
      <li className='text-sm flex items-center gap-x-4 p-2 hover:bg-highlight rounded-md mt-2 '>
        <span className='text-2xl block float-left'>{icon}</span>
        <span className={`text-base flex-1 font-semibold ${!open && 'hidden'}`}>
          {title}
        </span>
      </li>
    </Link>
  );
}
