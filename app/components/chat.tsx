'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';

import { useUserCountry } from '@/app/hooks/use-user-country';
import { socket } from '@/app/lib/socket';
import type { ChatMessage, SystemMessage } from '@/shared/socket-events';

const ANONYMOUS_NAME = 'Anonymous';

/** 장시간 접속해도 메모리가 계속 늘지 않도록 화면에 유지할 메시지 수를 제한합니다. */
const MAX_ENTRIES = 200;

/** 화면에 그리기 위해 서버 페이로드에 식별자와 종류를 덧붙인 형태 */
type ChatEntry =
  | ({ id: string; kind: 'user' } & ChatMessage)
  | ({ id: string; kind: 'system' } & SystemMessage);

const createId = () => crypto.randomUUID();

const appendEntry = (entries: ChatEntry[], entry: ChatEntry): ChatEntry[] =>
  [...entries, entry].slice(-MAX_ENTRIES);

export default function Chat() {
  const { data: session } = useSession();
  const country = useUserCountry();

  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [userList, setUserList] = useState<string[]>([]);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const name = session?.user?.name ?? ANONYMOUS_NAME;
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (message: ChatMessage) =>
      setEntries((prev) =>
        appendEntry(prev, { ...message, id: createId(), kind: 'user' }),
      );

    const handleSystem = (message: SystemMessage) =>
      setEntries((prev) =>
        appendEntry(prev, { ...message, id: createId(), kind: 'system' }),
      );

    socket.on('message', handleMessage);
    socket.on('system', handleSystem);
    socket.on('userCount', setUserCount);
    socket.on('userList', setUserList);

    return () => {
      socket.off('message', handleMessage);
      socket.off('system', handleSystem);
      socket.off('userCount', setUserCount);
      socket.off('userList', setUserList);
    };
  }, []);

  // 새 메시지가 붙으면 맨 아래로 따라갑니다.
  useEffect(() => {
    if (entries.length === 0) return;
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [entries.length]);

  const sendMessage = () => {
    const content = draft.trim();
    if (!content) return;

    // 서버는 보낸 사람을 제외한 나머지에게만 브로드캐스트하므로
    // 내 화면에는 직접 추가합니다.
    const message: ChatMessage = {
      sender: name,
      content,
      country: country ?? '',
    };

    socket.emit('message', message);
    setEntries((prev) =>
      appendEntry(prev, { ...message, id: createId(), kind: 'user' }),
    );
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter 는 줄바꿈, Enter 는 전송입니다.
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    sendMessage();
  };

  const toggleUserList = () => {
    socket.emit('requestUserList');
    setIsUserListOpen((prev) => !prev);
  };

  return (
    <aside
      aria-label='채팅'
      className={`bg-sub2 relative z-50 flex h-screen max-h-screen shrink-0 flex-col justify-between p-2 duration-300 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <button
        type='button'
        aria-label={isCollapsed ? '채팅 열기' : '채팅 접기'}
        aria-expanded={!isCollapsed}
        className='border-sub1 hover:bg-highlight absolute top-9 -left-3 rounded-full border-2 bg-white text-black duration-300 hover:text-white'
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <BsArrowLeftShort
          className={`text-3xl duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </button>

      <div className='bg-sub1 mx-3 mb-4 flex flex-col items-center justify-center gap-1 rounded-sm select-none'>
        <button
          type='button'
          aria-label='접속자 명단'
          aria-expanded={isUserListOpen}
          className='flex items-center justify-center gap-1'
          onClick={toggleUserList}
        >
          <FaUser />
          <span>{userCount}</span>
        </button>

        {isUserListOpen && (
          <ul className='max-h-48 w-full overflow-y-auto rounded-sm px-3 py-2 text-center font-bold text-white shadow-sm'>
            {userList.map((user) => (
              <li
                key={user}
                className='duration-300 hover:bg-white hover:text-black'
              >
                {user}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div className='grow overflow-y-auto'>
            {entries.map((entry) => (
              <div key={entry.id} className='p-2'>
                {entry.kind === 'user' && (
                  <div className='mb-1 flex items-center gap-2 text-xs font-bold'>
                    {entry.country && (
                      <Image
                        src={`/images/flags/${entry.country}.png`}
                        alt={entry.country}
                        width={30}
                        height={20}
                      />
                    )}
                    <span>{entry.sender}</span>
                  </div>
                )}
                <div
                  className={`w-full rounded-sm p-1 wrap-break-word ${
                    entry.kind === 'system'
                      ? 'bg-white text-black select-none'
                      : 'bg-sub1'
                  }`}
                >
                  {entry.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div
            className={`bg-sub1 mt-4 flex rounded-sm border-2 ${
              isFocused ? 'border-highlight' : 'border-sub1'
            }`}
          >
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className='bg-sub1 w-full resize-none rounded-lg p-2 text-xl outline-none'
              placeholder='Type message...'
              aria-label='메시지 입력'
              rows={2}
            />
            <button
              type='button'
              aria-label='메시지 전송'
              onClick={sendMessage}
              className='bg-sub1 hover:text-highlight ml-2 flex items-center justify-center rounded-sm p-2 font-bold duration-300'
            >
              <IoMdSend size={20} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
