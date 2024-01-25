import type { NextApiRequest, NextApiResponse } from 'next';

export function get(req: NextApiRequest, res: NextApiResponse) {
  const time = new Date();
  res.status(200).json({ time: time.toISOString() });
}
