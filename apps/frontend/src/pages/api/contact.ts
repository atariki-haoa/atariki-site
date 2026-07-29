import { NextApiRequest, NextApiResponse } from 'next';
import csrf from 'csrf';
import cookieParser from 'cookie-parser';
import { runMiddleware } from '../../utils/middleware';
import { sendContactMessage } from '../../server/backendClient';

const csrfProtection = new csrf();
const csrfSecret = process.env.CSRF_SECRET || csrfProtection.secretSync();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cookieParser());

  const secret = req.cookies?._csrf || csrfSecret;
  const token = req.headers['csrf-token'] || req.headers['x-csrf-token'] || req.body?._csrf;

  if (!secret || !token || !csrfProtection.verify(secret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  const { name, email, message } = req.body;
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress;

  try {
    const backendRes = await sendContactMessage({ name, email, message }, clientIp);
    const data = await backendRes.json();
    res.status(backendRes.status).json(data);
  } catch (error) {
    console.error('Error proxying contact request:', error);
    res.status(502).json({ error: 'Error al enviar el correo. Inténtalo de nuevo más tarde.' });
  }
}

export default handler;
