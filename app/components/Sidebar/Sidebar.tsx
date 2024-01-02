import React, { useState } from 'react';

import { Disclosure } from '@headlessui/react';
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineIntegrationInstructions,
  MdOutlineMoreHoriz,
  MdOutlineSettings,
  MdOutlineLogout,
} from 'react-icons/md';
import { GiGrandPiano } from 'react-icons/gi';
import { CgProfile } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlinePiano } from 'react-icons/md';
import { FaRegComments } from 'react-icons/fa';
import { BiMessageSquareDots } from 'react-icons/bi';

const sidebarItems: string[] = [
  'Dashboard',
  'Profile',
  'Comments',
  'Analytics',
  'Messages',
  'Integration',
  'Settings',
  'More',
  'Logout',
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState<string>(sidebarItems[0]);

  return (
    <div>
      <Disclosure as='nav'>
        <Disclosure.Button className='absolute top-4 left-4 inline-flex items-center peer justify-center rounded-md p-2 text-white hover:text-highlight focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group'>
          <GiHamburgerMenu className='block h-6 w-6' aria-hidden='true' />
        </Disclosure.Button>
        <div className='p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200'>
          <div className='flex flex-col justify-start item-center'>
            <h1 className='text-base text-center cursor-pointer font-bold text-highlight border-b border-gray-100 pb-4 w-full'>
              Together Piano
            </h1>

            <div className=' my-4 border-b border-gray-100 pb-4'>
              <div className='flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto'>
                <MdOutlinePiano className='text-2xl text-gray-600 group-hover:text-white ' />
                <h3 className='text-base text-gray-800 group-hover:text-white font-semibold '>
                  Piano
                </h3>
              </div>

              <div className='flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto'>
                <FaRegComments className='text-2xl text-gray-600 group-hover:text-white ' />
                <h3 className='text-base text-gray-800 group-hover:text-white font-semibold '>
                  Comments
                </h3>
              </div>
            </div>
            {/* setting  */}
            <div className=' my-4 border-b border-gray-100 pb-4'>
              <div className='flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto'>
                <CgProfile className='text-2xl text-gray-600 group-hover:text-white ' />
                <h3 className='text-base text-gray-800 group-hover:text-white font-semibold '>
                  Profile
                </h3>
              </div>
              <div className='flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto'>
                <MdOutlineSettings className='text-2xl text-gray-600 group-hover:text-white ' />
                <h3 className='text-base text-gray-800 group-hover:text-white font-semibold '>
                  Settings
                </h3>
              </div>
            </div>
            {/* logout */}
            <div className=' my-4'>
              <div className='flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto'>
                <MdOutlineLogout className='text-2xl text-gray-600 group-hover:text-white ' />
                <h3 className='text-base text-gray-800 group-hover:text-white font-semibold '>
                  Logout
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}
