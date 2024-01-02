'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { AiOutlineHome } from 'react-icons/ai';
import { BsPeople } from 'react-icons/bs';
import { TiContacts } from 'react-icons/ti';
import { FiMail } from 'react-icons/fi';

const sidebarItems = [
  {
    name: 'Home',
    href: '/',
    icon: <AiOutlineHome />,
  },
  {
    name: 'About',
    href: '/about',
    icon: <BsPeople />,
  },
  {
    name: 'Mails',
    href: '/mails',
    icon: <FiMail />,
  },
  {
    name: 'Contact',
    href: '/contact',
    icon: <TiContacts />,
  },
];

const Sidebar = () => {
  const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext);

  return (
    <div className='sidebar__wrapper'>
      <button className='btn' onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <aside className='sidebar' data-collapse={isCollapsed}>
        <div className='sidebar__top'>
          <Image
            width={80}
            height={80}
            className='sidebar__logo'
            src='/logo.jpg'
            alt='logo'
          />
          <p className='sidebar__logo-name'>The Brave Coders</p>
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
};

export default Sidebar;
