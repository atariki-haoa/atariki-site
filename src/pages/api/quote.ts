import { NextApiRequest, NextApiResponse } from 'next';
import MailgunService from '../../utils/mailgun';
import { calculateQuoteEstimate } from '../../utils/quoteCalculator';

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
  timeline: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone, email, budget, technology, timeline }: QuoteFormData = req.body;

    if (!name || !email || !budget || !technology || !timeline) {
      return res.status(400).json({ 
        message: 'Faltan campos obligatorios' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Formato de email inválido' 
      });
    }

    const budgetNumber = Number(budget);
    if (Number.isNaN(budgetNumber) || budgetNumber <= 0) {
      return res.status(400).json({
        message: 'El presupuesto debe ser un número válido',
      });
    }

    const timelineNumber = Number(timeline);
    if (Number.isNaN(timelineNumber) || timelineNumber < 1) {
      return res.status(400).json({
        message: 'El plazo estimado debe ser un número de meses válido',
      });
    }

    const allowedTechnologies = ['web_app', 'integrations', 'mobile_app', 'other'] as const;
    const normalizedTechnology = allowedTechnologies.includes(technology as typeof allowedTechnologies[number])
      ? (technology as typeof allowedTechnologies[number])
      : 'other';

    const estimate = calculateQuoteEstimate({
      budget: budgetNumber,
      technology: normalizedTechnology,
      timelineMonths: timelineNumber,
    });

    const quoteData = {
      name: name.trim(),
      phone: phone?.trim() || '',
      email: email.trim(),
      budget: budgetNumber,
      technology: normalizedTechnology,
      timelineMonths: timelineNumber,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
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
      message: 'Cotización recibida exitosamente',
      quoteId: `quote_${Date.now()}`,
      estimate
    });

  } catch (error) {
    console.error('Error processing quote request:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}
