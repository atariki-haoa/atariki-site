import { NextApiRequest, NextApiResponse } from 'next';
import MailgunService from '../../utils/mailgun';

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone, email, budget, technology }: QuoteFormData = req.body;

    if (!name || !email || !budget || !technology) {
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

    const quoteData = {
      name: name.trim(),
      phone: phone?.trim() || '',
      email: email.trim(),
      budget: parseInt(budget),
      technology,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    };

    console.log('Nueva solicitud de cotización:', quoteData);

    // Enviar notificación por email usando Mailgun
    try {
      const mailgunService = new MailgunService();
      await mailgunService.sendQuoteNotification({
        name: quoteData.name,
        phone: quoteData.phone,
        email: quoteData.email,
        budget: quoteData.budget,
        technology: quoteData.technology
      });
      
      console.log('Notificación de cotización enviada por email');
    } catch (emailError) {
      console.error('Error al enviar notificación por email:', emailError);
      // No fallar la respuesta si el email falla, solo loguear el error
    }

    res.status(200).json({ 
      message: 'Cotización recibida exitosamente',
      quoteId: `quote_${Date.now()}`
    });

  } catch (error) {
    console.error('Error processing quote request:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
}
