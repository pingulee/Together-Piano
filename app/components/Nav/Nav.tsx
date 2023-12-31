import { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* 햄버거 메뉴 버튼 */}
      <button onClick={toggleSidebar}>
        {/* 햄버거 아이콘 구현 */}
      </button>

      {/* 사이드바 */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* 사이드바 내용 */}
      </div>
    </div>
  );
}