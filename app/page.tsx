'use client';

import Sidebar from './components/Sidebar/Sidebar';
import Main from './components/Main/Main';

export default function Home() {
  return (
    <div className='flex flex-col'>
      <Sidebar />
      <div>
        <Main />
      </div>
    </div>
  );
}
