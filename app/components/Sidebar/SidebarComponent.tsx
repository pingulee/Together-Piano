'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SidebarItemHrefProp } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemHrefProp';
import { SidebarItemIconProp } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemIconProp';
import { SidebarItemNameProp } from '@/app/interfaces/Sidebar/SidebarItem/SidebarItemNameProp';

import { AiOutlineHome } from 'react-icons/ai';
import { MdPiano } from 'react-icons/md';
import { BsPeople } from 'react-icons/bs';
import { TiContacts } from 'react-icons/ti';

export interface SidebarItemProps
  extends SidebarItemHrefProp,
    SidebarItemIconProp,
    SidebarItemNameProp {}

const sidebarItems: SidebarItemProps[] = [
  {
    name: 'Home',
    href: '/',
    icon: <AiOutlineHome />,
  },
  {
    name: 'Piano',
    href: '/piano',
    icon: <MdPiano />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <BsPeople />,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: <TiContacts />,
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar__wrapper ${isCollapsed ? 'collapsed' : ''}`}>
      <button className='btn' onClick={toggleSidebar}></button>
      <aside className='sidebar'>
        <div className='sidebar__top'>
          <Image
            width={200}
            height={200}
            className='sidebar__logo'
            src='/logo.webp'
            alt='logo'
          />
          <p className='sidebar__logo-name'>Together Piano</p>
        </div>
        <ul className='sidebar__list'>
          {sidebarItems.map(({ name, href, icon }) => (
            <li className='sidebar__item' key={name}>
              <Link href={href} className={`sidebar__link`}>
                <span className='sidebar__icon'>{icon}</span>
                <span className='sidebar__name'>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
