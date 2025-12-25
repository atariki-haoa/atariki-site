import { NextApiRequest, NextApiResponse } from 'next';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import rateLimit from 'express-rate-limit';
import { runMiddleware } from '../../utils/middleware';
import csrf from 'csrf';
import cookieParser from 'cookie-parser';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ 
  username: 'api', 
  key: process.env.MAILGUN_API_KEY as string });

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Has alcanzado el límite de envíos de correos. Por favor, intenta más tarde.',
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' 
      ? forwarded.split(',')[0].trim() 
      : req.socket?.remoteAddress || 'unknown';
    return ip;
    
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const csrfProtection = new csrf();
const csrfSecret = process.env.CSRF_SECRET || csrfProtection.secretSync();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cookieParser());
  // await runMiddleware(req, res, contactLimiter);

  const secret = req.cookies?._csrf || csrfSecret;
  const token = req.headers['csrf-token'] || req.headers['x-csrf-token'] || req.body?._csrf;
  
  if (!secret || !token || !csrfProtection.verify(secret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  const { name, message } = req.body;
  const email = 'ariel@atariki.dev';

  const data = {
    from: email,
    to: 'ariel@atariki.com', // Cambia esto por tu correo
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: message,
    html: `<p><strong>De:</strong> ${name} (${email})</p><p>${message}</p>`,
  };

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN as string, data);
    res.status(200).send({ success: true, message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).send({ error: 'Error al enviar el correo. Inténtalo de nuevo más tarde.' });
  }
}

export default handler;