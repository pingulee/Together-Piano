<div className='flex items-center justify-center w-full'>
  <div className='flex flex-col max-w-lg p-8 bg-sub1 rounded-lg shadow-lg mx-4'>
    <label htmlFor='title' className='text-white'>
      제목
    </label>
    <input
      type='text'
      id='title'
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className='bg-white p-2 rounded-lg my-2 focus:outline-none focus:ring focus:ring-blue-300'
    />
    <label htmlFor='content' className='text-white'>
      내용
    </label>
    <textarea
      id='content'
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className='bg-white p-2 rounded-lg my-2 h-40 resize-none focus:outline-none focus:ring focus:ring-blue-300'
    />
    <button
      type='submit'
      className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 mt-4 cursor-pointer'
    >
      글 작성
    </button>
  </div>
</div>;
