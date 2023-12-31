export default function Main() {
  return (
    <main className='container mx-auto px-4 '>
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>
        {/* 각 게시물은 이런 형태의 카드로 표현 */}
        <article className='bg-white rounded-lg shadow-lg p-4'>
          <h2 className='text-xl font-semibold mb-2'>글 제목</h2>
          <p>글 내용 요약...</p>
        </article>
        {/* 추가 게시물 카드들... */}
      </section>
    </main>
  );
}
