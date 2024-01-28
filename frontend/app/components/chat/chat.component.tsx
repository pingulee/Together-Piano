import React, { useState } from 'react'; // KeyboardEvent 타입을 추가로 임포트합니다.

import { FaUser } from 'react-icons/fa';
import { BsArrowLeftShort } from 'react-icons/bs';
import { IoMdSend, IoMdClose } from 'react-icons/io';
import { useSocket } from '@/app/hooks/socket/socket.hook';
import { useKeyDown } from '@/app/hooks/enter/enter.hook';
import { useFocus } from '@/app/hooks/textarea/textarea-focus.hooks';
import { useOpen } from '@/app/hooks/side-open/side-open.hook';
import { useAutoScrollToBottom } from '@/app/hooks/scroll/scroll-bottom';

//
interface UserCountModalProps {
  userCount: number;
  closeModal: () => void;
}

const UserCountModal = ({ userCount, closeModal }: UserCountModalProps) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
      <div className='flex flex-col p-4 rounded items-center'>
        <div className='text-xl font-semibold'>현재 접속한 사용자 수</div>
        <div className='text-2xl mt-2'>{userCount}명</div>
        <div
          className='mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          onClick={closeModal}
        >
          <IoMdClose size='24px' /> {/* IoMdClose 아이콘 추가 */}
        </div>
      </div>
    </div>
  );
};
//

export default function Chat() {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    userCount,
    handleSendMessage,
  } = useSocket();
  const { isFocused, setIsFocused } = useFocus();
  const { open, setOpen } = useOpen();
  const messagesEndRef = useAutoScrollToBottom([messages]);
  const handleKeyDown = useKeyDown(handleSendMessage);

  //
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 창 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 창 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  //

  return (
    <div
      className={`flex flex-col min-w-0 max-w-72 bg-sub2 h-screen p-2 duration-300 relative justify-between ${
        open ? 'w-20' : 'w-72'
      }`}
    >
      <BsArrowLeftShort
        className={`bg-white text-black text-3xl rounded-full absolute -left-3 top-9 border-2 border-sub1 ${
          open && 'rotate-180'
        }`}
        onClick={() => setOpen(!open)}
      />

      {/* 현재 접속한 사용자 수를 표시하는 모달 열기 버튼 */}
      <div
        className='mb-4 flex bg-sub1 border-2 rounded border-sub1 justify-center items-center cursor-pointer'
        onClick={openModal}
      >
        <FaUser />
        <span>{userCount}</span>
      </div>

      {/* 모달 창 */}
      {isModalOpen && (
        <UserCountModal userCount={userCount} closeModal={closeModal} />
      )}

      {/* open 상태가 false일 때만 채팅 목록과 입력 필드를 렌더링 */}
      {!open && (
        <>
          <div className='flex-grow overflow-y-scroll'>
            {messages.map((msg, index) => (
              <div key={index} className='p-2'>
                <div className='text-xs font-bold mb-1'>{msg.sender}</div>
                <div className='bg-sub1 rounded w-full break-words p-1'>
                  {msg.content.split('\n').map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                      {line}
                      {lineIndex < msg.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            className={`mt-4 flex bg-sub1 border-2 rounded ${
              isFocused ? 'border-highlight' : 'border-sub1'
            }`}
          >
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className='bg-sub1 text-xl rounded-lg p-2 w-full resize-none outline-none'
              placeholder='Type message...'
              rows={2}
            />
            <div
              onClick={handleSendMessage}
              className='ml-2 bg-sub1 text-highlight hover:text-subHighlight font-bold p-2 rounded flex items-center justify-center'
            >
              <IoMdSend size='20px' />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
