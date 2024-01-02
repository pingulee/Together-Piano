import { createContext, useState, ReactNode, useContext } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface SidebarContextProps {
  isCollapsed: boolean;
  toggleSidebarcollapse: () => void;
}

const initialValue: SidebarContextProps = {
  isCollapsed: false,
  toggleSidebarcollapse: () => {}, // 빈 함수 추가
};

export const SidebarContext = createContext<SidebarContextProps>(initialValue);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isCollapsed, setCollapse] = useState<boolean>(false);

  const toggleSidebarcollapse = () => {
    setCollapse((prevState) => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebarcollapse }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default function Sidebar() {
  const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext);

  return (
    <div className='sidebar__wrapper'>
      <button className='btn' onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      {/* 이하 생략 */}
    </div>
  );
}
