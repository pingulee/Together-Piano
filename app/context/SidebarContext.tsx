import { createContext, useState, ReactNode } from 'react';

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

export default function SidebarProvider({ children }: SidebarProviderProps) {
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
