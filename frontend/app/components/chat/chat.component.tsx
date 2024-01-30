import React, { useState } from 'react'; // KeyboardEvent 타입을 추가로 임포트합니다.
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { BsArrowLeftShort } from 'react-icons/bs';
import { IoMdSend, IoMdClose } from 'react-icons/io';
import { useSocket } from '@/app/hooks/socket/socket.hook';
import { useKeyDown } from '@/app/utils/enter/enter.util';
import { useFocus } from '@/app/hooks/textarea-focus/textarea-focus.hooks';
import { useSideOpen } from '@/app/hooks/side-open/side-open.hook';
import { useAutoScrollToBottom } from '@/app/hooks/scroll/scroll-bottom.hook';
import { useUserCountry } from '@/app/hooks/user-country/user-country.hook';

export default function Chat() {
  const {
    messages,
    setMessages,
    currentMessage,
    setCurrentMessage,
    userCount,
    setUserCount,
    handleSendMessage,
  } = useSocket();
  const { isFocused, setIsFocused } = useFocus();
  const { open, setOpen } = useSideOpen();
  const messagesEndRef = useAutoScrollToBottom([messages]);
  const handleKeyDown = useKeyDown(handleSendMessage);
  const userCountry = useUserCountry();
  const flagImagePath = `/images/flags/${userCountry?.toLowerCase()}.png`;

  return (
    <div
      className={`flex min-h-screen max-h-screen flex-col min-w-20 duration-300 max-w-72 bg-sub2 h-screen p-2 relative justify-between z-50 ${
        open ? 'w-20' : 'w-72'
      }`}
    >
      <BsArrowLeftShort
        className={`bg-white text-black text-3xl rounded-full absolute -left-3 top-9 border-2 border-sub1 hover:bg-highlight hover:text-white duration-300 cursor-pointer ${
          !open && 'rotate-180'
        }`}
        onClick={() => setOpen(!open)}
      />

      {/* 현재 접속한 사용자 수를 표시하는 모달 열기 버튼 */}
      <div className='mb-4 flex bg-sub1 border-2 rounded border-sub1 justify-center items-center cursor-pointer hover:bg-white hover:text-black duration-300'>
        <FaUser />
        <span>{userCount}</span>
      </div>

      {/* open 상태가 false일 때만 채팅 목록과 입력 필드를 렌더링 */}
      {!open && (
        <>
          <div className='flex-grow overflow-y-scroll'>
            {messages.map((msg, index) => (
              <div key={index} className='p-2'>
                <div className='flex text-xs font-bold mb-1 gap-2 items-center'>
                  <Image
                    src={`${flagImagePath}`}
                    alt={msg.userCountry}
                    width={30}
                    height={30}
                  />
                  {msg.sender}{' '}
                </div>
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
              className='ml-2 bg-sub1 hover:text-highlight font-bold p-2 rounded flex items-center justify-center duration-300 cursor-pointer'
            >
              <IoMdSend size='20px' />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
