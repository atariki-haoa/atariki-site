import { NextApiRequest, NextApiResponse } from 'next';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import rateLimit from 'express-rate-limit';
import { runMiddleware } from '../../utils/middleware';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ 
  username: 'api', 
  key: process.env.MAILGUN_API_KEY as string });

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Has alcanzado el límite de envíos de correos. Por favor, intenta más tarde.',
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, contactLimiter);

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
    res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo. Inténtalo de nuevo más tarde.' });
  }
}

export default handler;
