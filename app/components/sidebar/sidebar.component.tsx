// SidebarComponent.tsx

'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

import { GiGrandPiano } from 'react-icons/gi';
import { FaHouse } from 'react-icons/fa6';
import { MdFeedback, MdContactEmergency } from 'react-icons/md';
import { BiSolidPiano } from 'react-icons/bi';
import {
  RiAccountBoxFill,
  RiLoginBoxFill,
  RiLogoutBoxFill,
} from 'react-icons/ri';

import SidebarItem from '@/app/components/sidebar/sidebar-item.component';
import { useSideOpen } from '@/app/hooks/side-open/side-open.hook';

export default function Sidebar() {
  const { data: session } = useSession();
  const { open, setOpen } = useSideOpen();

  const upMenuItems = [
    { title: 'Home', icon: <FaHouse />, href: '/' },
    { title: 'Piano', icon: <BiSolidPiano />, href: '/piano' },
    // { title: 'Feedback', icon: <MdFeedback />, href: '/feedback' },
    { title: 'Contact', icon: <MdContactEmergency />, href: '/contact' },
  ];
  let downMenuItems = session
    ? [
        {
          title: 'Profile',
          icon: <RiAccountBoxFill />,
          href: '/profile',
        },
      ]
    : [{ title: 'Login', icon: <RiLoginBoxFill />, href: '/login' }];

  return (
    <nav
      className={`flex flex-col bg-sub2 min-h-screen max-h-screen p-5 pt-8 duration-300 relative select-none z-50 min-w-20 max-w-72 ${
        open ? 'w-72' : 'w-20'
      }
    `}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className='inline-flex items-center '>
        <GiGrandPiano
          className={`bg-white text-black text-4xl rounded block float-left flex-shrink-0 mr-2 duration-500 ${
            !open && 'rotate-[360deg]'
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

      <div className='flex flex-col flex-grow justify-between center'>
        <div className='pt-2'>
          {upMenuItems.map((menu, index) => (
            <SidebarItem
              title={menu.title}
              icon={menu.icon}
              open={open}
              key={index}
              href={menu.href}
            />
          ))}
        </div>

        <div className='pt-2'>
          {downMenuItems.map((menu, index) => (
            <SidebarItem
              title={menu.title}
              icon={menu.icon}
              open={open}
              key={index}
              href={menu.href}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
