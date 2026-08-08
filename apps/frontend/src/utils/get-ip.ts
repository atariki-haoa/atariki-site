import { NextApiRequest, NextApiResponse } from 'next';

export default function getIp(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const forwarded = req.headers['x-forwarded-for'];
  req.ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
  next();
}