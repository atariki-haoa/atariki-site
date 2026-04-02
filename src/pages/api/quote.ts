import { NextApiRequest, NextApiResponse } from 'next';
import MailgunService from '../../utils/mailgun';
import { calculateQuoteEstimate } from '../../utils/quoteCalculator';
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from '../../types/locale';
import csrf from 'csrf';
import cookieParser from 'cookie-parser';
import { runMiddleware } from '../../utils/middleware';

const csrfProtection = new csrf();
const csrfSecret = process.env.CSRF_SECRET || csrfProtection.secretSync();

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
  timeline: string;
  locale?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await runMiddleware(req, res, cookieParser());

  const secret = req.cookies?._csrf || csrfSecret;
  const token = req.headers['csrf-token'] || req.headers['x-csrf-token'] || req.body?._csrf;

  if (!secret || !token || !csrfProtection.verify(secret, token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  let normalizedLocale: Locale = DEFAULT_LOCALE;
  let messages = {
    missingFields: 'Required fields are missing',
    invalidEmail: 'Invalid email format',
    invalidBudget: 'Budget must be a valid number',
    invalidTimeline: 'Timeline must be a valid month count',
    success: 'Estimate received successfully',
    failure: 'Unable to generate the estimate.',
    serverError: 'Internal server error',
  };

  try {
    const { name, phone, email, budget, technology, timeline, locale }: QuoteFormData = req.body;
    normalizedLocale = isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;

    messages = normalizedLocale === 'es'
      ? {
          missingFields: 'Faltan campos obligatorios',
          invalidEmail: 'Formato de email inválido',
          invalidBudget: 'El presupuesto debe ser un número válido',
          invalidTimeline: 'El plazo estimado debe ser un número de meses válido',
          success: 'Cotización recibida exitosamente',
          failure: 'No se pudo generar la cotización.',
          serverError: 'Error interno del servidor',
        }
      : {
          missingFields: 'Required fields are missing',
          invalidEmail: 'Invalid email format',
          invalidBudget: 'Budget must be a valid number',
          invalidTimeline: 'Timeline must be a valid month count',
          success: 'Estimate received successfully',
          failure: 'Unable to generate the estimate.',
          serverError: 'Internal server error',
        };

    if (!name || !email || !budget || !technology || !timeline) {
      return res.status(400).json({
        message: messages.missingFields,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: messages.invalidEmail,
      });
    }

    const budgetNumber = Number(budget);
    if (Number.isNaN(budgetNumber) || budgetNumber <= 0) {
      return res.status(400).json({
        message: messages.invalidBudget,
      });
    }

    const timelineNumber = Number(timeline);
    if (Number.isNaN(timelineNumber) || timelineNumber < 1) {
      return res.status(400).json({
        message: messages.invalidTimeline,
      });
    }

    const allowedTechnologies = ['web_app', 'integrations', 'mobile_app', 'other'] as const;
    const normalizedTechnology = allowedTechnologies.includes(technology as typeof allowedTechnologies[number])
      ? (technology as typeof allowedTechnologies[number])
      : 'other';

    const estimate = calculateQuoteEstimate(
      {
        budget: budgetNumber,
        technology: normalizedTechnology,
        timelineMonths: timelineNumber,
      },
      normalizedLocale
    );

    const quoteData = {
      name: name.trim(),
      phone: phone?.trim() || '',
      email: email.trim(),
      budget: budgetNumber,
      technology: normalizedTechnology,
      timelineMonths: timelineNumber,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      locale: normalizedLocale,
    };

    console.log('Nueva solicitud de cotización:', quoteData);
    console.log('Resultado estimado (gratuito):', estimate);

    // Enviar notificación por email usando Mailgun
    try {
      const mailgunService = new MailgunService();
      await mailgunService.sendQuoteNotification({
        name: quoteData.name,
        phone: quoteData.phone,
        email: quoteData.email,
        budget: quoteData.budget,
        technology: quoteData.technology,
        timelineMonths: quoteData.timelineMonths,
        recommendedBudgetMin: estimate.recommendedBudget.min,
        recommendedBudgetMax: estimate.recommendedBudget.max,
        budgetAdequacy: estimate.budgetAdequacy,
        timelinePressure: estimate.timelinePressure,
      });
      
      console.log('Notificación de cotización enviada por email');
    } catch (emailError) {
      console.error('Error al enviar notificación por email:', emailError);
      // No fallar la respuesta si el email falla, solo loguear el error
    }

    res.status(200).json({ 
      message: messages.success,
      quoteId: `quote_${Date.now()}`,
      estimate
    });

  } catch (error) {
    console.error('Error processing quote request:', error);
    res.status(500).json({
      message: messages.serverError,
    });
  }
}
