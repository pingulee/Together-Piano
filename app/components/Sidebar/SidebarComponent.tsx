// SidebarComponent.tsx

'use client';

import React, { useState } from 'react';

// 넥스트
import Image from 'next/image';
import Link from 'next/link';

// 아이콘
import { BsArrowLeftShort } from 'react-icons/bs';
import { GiGrandPiano } from 'react-icons/gi';
import { FaHouse } from 'react-icons/fa6';
import { FaCog } from 'react-icons/fa';
import { MdPiano } from 'react-icons/md';
import { MdOutlineContactPhone } from 'react-icons/md';

// 컴포넌트
import SidebarItemComponent from '@/components/Sidebar/SidebarItemComponent';
import SeparatorComponent from '@/components/SeparatorComponent';

export default function SidebarComponent() {
  const [open, setOpen] = useState(true);
  const upMenuItems = [
    { title: 'Home', icon: <FaHouse />, href: '/' },
    { title: 'Piano', icon: <MdPiano />, href: '/piano' },
    { title: 'Contact', icon: <MdOutlineContactPhone />, href: '/contact' },
  ];
  const downMenuItems = [
    { title: 'Settings', icon: <FaCog />, href: '/setting' },
  ];

  return (
    <div
    className={`bg-sub2 h-screen p-5 pt-8 ${open ? 'w-72' : 'w-20'}
    duration-300 relative shadow-lg`}
    >
      <BsArrowLeftShort
        className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border-2 border-sub ${
          !open && 'rotate-180'
        }`}
        onClick={() => setOpen(!open)}
      />
      <div className='inline-flex items-center'>
        <GiGrandPiano
          className={`bg-white text-black text-4xl rounded block float-left flex-shrink-0 mr-2 duration-500 ${
            open && 'rotate-[360deg]'
          }`}
        />
        <h1
          className={`text-white origin-left font-black text-xl duration-300 ${
            !open && 'hidden'
          }`}
        >
          Together
        </h1>
      </div>

      <div className='flex flex-col justify-between center'>
        <ul className='pt-2'>
          {upMenuItems.map((menu, index) => (
            <SidebarItemComponent
              title={menu.title}
              href={menu.href}
              icon={menu.icon}
              open={open}
              key={index}
            />
          ))}
        </ul>
        <SeparatorComponent />
        <ul className='pt-2'>
          {downMenuItems.map((menu, index) => (
            <SidebarItemComponent
              title={menu.title}
              href={menu.href}
              icon={menu.icon}
              open={open}
              key={index}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
