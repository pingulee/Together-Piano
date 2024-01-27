import React from 'react'; // KeyboardEvent 타입을 추가로 임포트합니다.

import { FaUser } from 'react-icons/fa';
import { BsArrowLeftShort } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import { useChat } from '@/app/hooks/chat/chat.hook';
import { useKeyDown } from '@/app/hooks/enter/enter.hook';

export default function Chat() {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    isFocused,
    setIsFocused,
    messagesEndRef,
    userCount,
    open,
    setOpen,
    handleSendMessage,
  } = useChat();

  const handleKeyDown = useKeyDown(handleSendMessage);

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

      <div className='mb-4 flex bg-sub1 border-2 rounded border-sub1 justify-center items-center'>
        <FaUser />
        <span>{userCount}</span>
      </div>

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
              className='bg-sub1 text-xl rounded-lg p-2 w-full resize-none outline-none'
              placeholder='Type message...'
              rows={2}
            />
            <div
              onClick={handleSendMessage}
              className='ml-2 bg-sub1 text-highlight hover:text-white font-bold p-2 rounded flex items-center justify-center'
            >
              <IoMdSend size='20px' />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
