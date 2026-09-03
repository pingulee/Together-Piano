'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';

import { useUserCountry } from '@/app/hooks/use-user-country';
import { socket } from '@/app/lib/socket';
import type { ChatMessage, SystemMessage } from '@/shared/socket-events';

/** 장시간 접속해도 메모리가 계속 늘지 않도록 화면에 유지할 메시지 수를 제한합니다. */
const MAX_ENTRIES = 200;

type ChatEntry =
  ({ kind: 'user' } & ChatMessage) | ({ kind: 'system' } & SystemMessage);

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * 서버가 붙인 id 로 중복을 걸러냅니다.
 *
 * 이전 구현은 보낸 메시지를 클라이언트가 직접 목록에 넣고 서버 브로드캐스트도
 * 받았기 때문에 경로가 둘로 갈려 같은 말이 두 번 찍혔습니다. 이제 서버가
 * 유일한 출처이고, 재연결로 같은 메시지가 다시 와도 id 로 막힙니다.
 */
function appendEntry(entries: ChatEntry[], entry: ChatEntry): ChatEntry[] {
  if (entries.some((existing) => existing.id === entry.id)) return entries;
  return [...entries, entry].slice(-MAX_ENTRIES);
}

export default function Chat() {
  const country = useUserCountry();

  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleChat = (message: ChatMessage) =>
      setEntries((prev) => appendEntry(prev, { ...message, kind: 'user' }));

    const handleSystem = (message: SystemMessage) =>
      setEntries((prev) => appendEntry(prev, { ...message, kind: 'system' }));

    socket.on('chat', handleChat);
    socket.on('system', handleSystem);

    return () => {
      socket.off('chat', handleChat);
      socket.off('system', handleSystem);
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

    // 화면에 직접 넣지 않습니다. 서버가 되돌려 주는 것만 그립니다.
    socket.emit('chat', { content, country: country ?? '' });
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter 는 줄바꿈, Enter 는 전송입니다.
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    sendMessage();
  };

  if (isCollapsed) {
    return (
      <button
        type='button'
        aria-label='채팅 열기'
        aria-expanded={false}
        onClick={() => setIsCollapsed(false)}
        className='border-line bg-surface text-ink-muted hover:text-ink flex w-11 shrink-0 flex-col items-center gap-2 border-l py-4 transition-colors'
      >
        <BsChevronRight className='rotate-180 text-lg' />
        <span
          className='text-xs font-semibold tracking-widest'
          style={{ writingMode: 'vertical-rl' }}
        >
          CHAT
        </span>
      </button>
    );
  }

  return (
    <aside
      aria-label='채팅'
      className='border-line bg-surface flex w-72 shrink-0 flex-col border-l'
    >
      <header className='border-line flex shrink-0 items-center justify-between border-b px-3 py-2.5'>
        <h2 className='text-sm font-semibold'>채팅</h2>
        <button
          type='button'
          aria-label='채팅 접기'
          aria-expanded
          onClick={() => setIsCollapsed(true)}
          className='text-ink-faint hover:bg-raised hover:text-ink rounded-md p-1 transition-colors'
        >
          <BsChevronRight />
        </button>
      </header>

      <div className='flex-1 space-y-3 overflow-y-auto px-3 py-3'>
        {entries.length === 0 && (
          <p className='text-ink-faint pt-6 text-center text-xs'>
            첫 메시지를 남겨 보세요
          </p>
        )}

        {entries.map((entry) =>
          entry.kind === 'system' ? (
            <p key={entry.id} className='text-ink-faint text-center text-xs'>
              {entry.content}
            </p>
          ) : (
            <div key={entry.id}>
              <div className='mb-1 flex items-center gap-1.5'>
                {entry.country && (
                  <Image
                    src={`/images/flags/${entry.country}.png`}
                    alt={entry.country}
                    width={18}
                    height={12}
                    className='shrink-0 rounded-xs'
                  />
                )}
                <span
                  className='truncate text-xs font-semibold'
                  style={{ color: entry.color }}
                >
                  {entry.sender}
                </span>
                <time className='text-ink-faint ml-auto shrink-0 text-[10px]'>
                  {timeFormatter.format(entry.sentAt)}
                </time>
              </div>
              <p className='bg-raised text-ink-muted rounded-lg rounded-tl-sm px-2.5 py-1.5 text-sm wrap-break-word'>
                {entry.content}
              </p>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      <div className='border-line shrink-0 border-t p-2.5'>
        <div
          className={`bg-raised flex items-end gap-1 rounded-lg border transition-colors ${
            isFocused ? 'border-accent' : 'border-line'
          }`}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className='placeholder:text-ink-faint max-h-24 w-full resize-none bg-transparent px-2.5 py-2 text-sm outline-none'
            placeholder='메시지 입력…'
            aria-label='메시지 입력'
            rows={2}
          />
          <button
            type='button'
            aria-label='메시지 전송'
            onClick={sendMessage}
            disabled={draft.trim().length === 0}
            className='text-ink-muted hover:bg-overlay hover:text-accent-hot m-1 shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-30'
          >
            <IoMdSend size={18} />
          </button>
        </div>
        <p className='text-ink-faint mt-1.5 px-1 text-[10px]'>
          Enter 전송 · Shift+Enter 줄바꿈
        </p>
      </div>
    </aside>
  );
}
