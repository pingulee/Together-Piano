import { SidebarItemHrefProp } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemHrefProp';
import { SidebarItemIconProp } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemIconProp';
import { SidebarItemNameProp } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemNameProp';
import Link from 'next/link';

export interface SidebarItemProps
  extends SidebarItemHrefProp,
    SidebarItemIconProp,
    SidebarItemNameProp {}

export default function SidebarItem({ name, href, icon }: SidebarItemProps) {
  return (
    <li className='sidebar__item'>
      <Link href={href}>
        <a className='sidebar__link'>
          <span className='sidebar__icon'>{icon}</span>
          <span className='sidebar__name'>{name}</span>
        </a>
      </Link>
    </li>
  );
}
