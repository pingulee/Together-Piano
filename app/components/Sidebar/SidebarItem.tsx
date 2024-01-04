import { SidebarItemHrefProps } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemHrefProps';
import { SidebarItemIconProps } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemIconProps';
import { SidebarItemNameProps } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemNameProps';
import Link from 'next/link';

export interface SidebarItemProps
  extends SidebarItemHrefProps,
    SidebarItemIconProps,
    SidebarItemNameProps {}

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
