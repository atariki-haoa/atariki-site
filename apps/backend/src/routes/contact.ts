import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import MailgunService from '../services/mailgunService.js';
import { escapeHtml } from '../utils/sanitize.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Has alcanzado el límite de envíos de correos. Por favor, intenta más tarde.',
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket?.remoteAddress || 'unknown';
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', contactLimiter, async (req, res) => {
  const { name, message } = req.body;
  const email = 'ariel@atariki.dev';

  const mailgunService = new MailgunService();

  try {
    await mailgunService.sendEmail({
      from: email,
      to: 'ariel@atariki.com',
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: message,
      html: `<p><strong>De:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message)}</p>`,
    });
    res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo. Inténtalo de nuevo más tarde.' });
  }
});

export default router;
