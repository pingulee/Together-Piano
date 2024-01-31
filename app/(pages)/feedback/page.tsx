'use client';

import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

/**
 * Contact 페이지 컴포넌트
 * @component
 */
export default function FeedbackPage() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [feedbackData, setFeedbackData] = useState<Array<any>>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const itemsPerPage = 10;

  let sampleData = [
    {
      id: 1,
      title: 'Sample Title 1',
      nickname: 'John Doe',
      date: '2024-01-31',
    },
    {
      id: 2,
      title: 'Sample Title 2',
      nickname: 'Jane Smith',
      date: '2024-02-01',
    },
    {
      id: 3,
      title: 'Sample Title 3',
      nickname: 'Alice Johnson',
      date: '2024-02-02',
    },
    {
      id: 4,
      title: 'Sample Title 4',
      nickname: 'Bob Wilson',
      date: '2024-02-03',
    },
    {
      id: 5,
      title: 'Sample Title 5',
      nickname: 'Eva Davis',
      date: '2024-02-04',
    },
    {
      id: 6,
      title: 'Sample Title 6',
      nickname: 'Chris Lee',
      date: '2024-02-05',
    },
    {
      id: 7,
      title: 'Sample Title 7',
      nickname: 'Grace Clark',
      date: '2024-02-06',
    },
    {
      id: 8,
      title: 'Sample Title 8',
      nickname: 'David Brown',
      date: '2024-02-07',
    },
    {
      id: 9,
      title: 'Sample Title 9',
      nickname: 'Sophia Taylor',
      date: '2024-02-08',
    },
    {
      id: 10,
      title: 'Sample Title 10',
      nickname: 'Michael Wilson',
      date: '2024-02-09',
    },
    {
      id: 11,
      title: 'Sample Title 5',
      nickname: 'Eva Davis',
      date: '2024-02-04',
    },
  ];

  useEffect(() => {
    const reversedData = [...sampleData].reverse();
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const truncatedData = reversedData.slice(startIndex, endIndex);
    setFeedbackData(truncatedData);
  }, [currentPage]);

  const handlePageChange = (selectedPage: { selected: number }) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <div className='flex flex-col items-center justify-center w-full max-h-screen overflow-auto'>
      <div className='w-4/5 min-w-4/5 max-w-4/5'>
        <table className='w-full bg-white shadow-md rounded-lg'>
          <thead>
            <tr className='bg-sub1 text-white'>
              <th className='px-6 py-3 w-1/5 text-left text-sm font-semibold uppercase'>
                Index
              </th>
              <th className='px-6 py-3 w-2/5 text-left text-sm font-semibold uppercase'>
                Content
              </th>
              <th className='px-6 py-3 w-1/5 text-left text-sm font-semibold uppercase'>
                Nickname
              </th>
              <th className='px-6 py-3 w-1/5 text-left text-sm font-semibold uppercase'>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((data) => (
              <tr key={data.id}>
                <td className='px-6 py-3 w-1/5 border-b border-gray-200 text-black'>
                  {data.id}
                </td>
                <td className='px-6 py-3 w-2/5 border-b border-gray-200 text-black'>
                  {data.title}
                </td>
                <td className='px-6 py-3 w-1/5 border-b border-gray-200 text-black'>
                  {data.nickname}
                </td>
                <td className='px-6 py-3 w-1/5 border-b border-gray-200 text-black'>
                  {data.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-center mt-4 '>
          <ReactPaginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={Math.ceil(sampleData.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={'pagination'}
            activeClassName={'active'}
            className='flex flex-row gap-2'
            pageClassName='relative cursor-pointer'
            pageLinkClassName='block py-2 px-3 bg-sub2  ease-in-out'
            previousClassName='relative cursor-pointer'
            nextClassName='relative cursor-pointer'
            previousLinkClassName='block py-2 px-3 bg-sub2 ease-in-out'
            nextLinkClassName='block py-2 px-3 bg-sub2 hover:transition duration-300 ease-in-out'
            disabledClassName='cursor-not-allowed bg-gray-300 text-gray-600'
          />
        </div>
      </div>
    </div>
  );
}
