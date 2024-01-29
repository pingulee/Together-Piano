import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 'x-forwarded-for' 헤더를 사용하거나, 없으면 req.socket에서 IP 주소를 가져옵니다.
  const forwarded = req.headers['x-forwarded-for'];
  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]
      : req.socket.remoteAddress;

  res.status(200).json({ ip });
}
