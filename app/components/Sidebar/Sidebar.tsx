'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdPiano,
} from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import { TiContacts } from 'react-icons/ti';

const sidebarItems = [
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
  // 사이드바 상태를 관리하는 훅
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 버튼 클릭 이벤트 핸들러
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
