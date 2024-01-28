import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();

  // 한국 시간대에 맞춘 포맷터 생성
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24시간 표시를 위해 hour12 옵션을 false로 설정
  });

  const formattedDateTime = formatter.format(now);

  return NextResponse.json({
    datetime: formattedDateTime, // 'YYYY-MM-DD HH:mm' 형식으로 변환
  });
}
