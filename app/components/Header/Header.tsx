export default function Header() {
  return (
    <header className='bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg'>
      <nav className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>내 화려한 블로그</h1>
        <div>
          <a href='#' className='text-white px-4'>
            홈
          </a>
          <a href='#' className='text-white px-4'>
            블로그
          </a>
          <a href='#' className='text-white px-4'>
            소개
          </a>
        </div>
      </nav>
    </header>
  );
}
