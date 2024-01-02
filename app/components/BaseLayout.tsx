import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: Props) {
  return (
    <div className='layout'>
      <Sidebar />
      <main className='layout__main-content'>{children}</main>;
    </div>
  );
}
