/**
 * UTC 시간을 포맷팅하여 반환합니다.
 * @returns {string} 포맷팅된 UTC 시간 문자열
 */
export default function getDateTime(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  };

  return new Intl.DateTimeFormat('ko-KR', options).format(now);
}
