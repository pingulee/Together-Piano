'use client';

import React, { useState } from 'react';

// 넥스트
import img from 'next/image';
import Link from 'next/link';

// 아이콘
import { GiGrandPiano } from 'react-icons/gi';
import { AiFillEnvironment, AiOutlineHome } from 'react-icons/ai';
import { MdPiano } from 'react-icons/md';
import { BsArrowLeftShort, BsPeople } from 'react-icons/bs';
import { TiContacts } from 'react-icons/ti';

export default function SidebarComponent() {
  const [open, setOpen] = useState(true);

  return (
    <div className='flex'>
      <div
        className={`bg-black h-screen p-5 pt-8 ${
          open ? 'w-72' : 'w-20'
        } duration-300 relative`}
      >
        <BsArrowLeftShort
          className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border border-black cursor-pointer ${
            open && 'rotate-180'
          }`}
          onClick={() => setOpen(!open)}
        />
        <div className='inline-flex '>
          <GiGrandPiano
            className={`bg-white text-4xl rounded cursor-pointer block float-left flex-shrink-0 mr-2 duration-500 ${
              open && 'rotate-[360deg]'
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-2xl duration-300 ${
              !open && 'scale-0'
            }`}
          >
            Together Piano
          </h1>
        </div>
      </div>
    </div>
  );
}
