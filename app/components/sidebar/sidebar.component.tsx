// SidebarComponent.tsx

'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';

import { BsArrowLeftShort } from 'react-icons/bs';
import { GiGrandPiano } from 'react-icons/gi';
import { FaHouse } from 'react-icons/fa6';
import { MdPiano } from 'react-icons/md';
import { MdOutlineContactPhone } from 'react-icons/md';
import { RiLoginBoxFill, RiLogoutBoxFill } from 'react-icons/ri';

import SidebarItem from '@/app/components/sidebar/sidebar-item.component';
import { useOpen } from '@/app/hooks/side-open/side-open.hook';

export default function Sidebar() {
  const { data: session } = useSession();
  const { open, setOpen } = useOpen();
  const upMenuItems = [
    { title: 'Home', icon: <FaHouse />, href: '/' },
    { title: 'Piano', icon: <MdPiano />, href: '/piano' },
    { title: 'Contact', icon: <MdOutlineContactPhone />, href: '/contact' },
  ];
  let downMenuItems = session
    ? [
        {
          title: 'Logout',
          icon: <RiLogoutBoxFill />,
          href: '/api/auth/signout',
        },
      ]
    : [{ title: 'Login', icon: <RiLoginBoxFill />, href: '/login' }];

  return (
    <nav
      className={`flex flex-col bg-sub2 h-screen p-5 pt-8 duration-300 relative ${
        open ? 'w-20' : 'w-72'
      }
    `}
    >
      <BsArrowLeftShort
        className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border-2 border-sub ${
          open && 'rotate-180'
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
            open && 'hidden'
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
              open={!open}
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
              open={!open}
              key={index}
              href={menu.href}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
