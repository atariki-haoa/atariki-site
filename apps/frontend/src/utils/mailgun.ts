import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { escapeHtml } from './sanitize';

interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

class MailgunService {
  private mg: any;
  private domain: string;

  constructor() {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;

    if (!apiKey || !domain) {
      throw new Error('MAILGUN_API_KEY y MAILGUN_DOMAIN son requeridos');
    }

    this.domain = domain;
    const mailgun = new Mailgun(FormData);
    this.mg = mailgun.client({
      username: 'api',
      key: apiKey,
    });
  }

  async sendEmail({ to, subject, text, html }: EmailData) {
    try {
      const messageData = {
        from: `Cotizaciones Atariki <noreply@${this.domain}>`,
        to,
        subject,
        text,
        html,
      };

      const response = await this.mg.messages.create(this.domain, messageData);
      console.log('Correo enviado con éxito:', response);
      return response;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
    }
  }

  async sendQuoteNotification(quoteData: {
    name: string;
    phone: string;
    email: string;
    budget: number;
    technology: string;
    timelineMonths?: number;
    recommendedBudgetMin?: number;
    recommendedBudgetMax?: number;
    budgetAdequacy?: string;
    timelinePressure?: string;
  }) {
    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
      }).format(amount);
    };

    const technologyLabels: { [key: string]: string } = {
      web_app: 'Aplicación Web',
      integrations: 'Integraciones',
      mobile_app: 'Aplicación Móvil',
      other: 'Otros'
    };

    const timelineLabel = quoteData.timelineMonths
      ? `${quoteData.timelineMonths} mes${quoteData.timelineMonths === 1 ? '' : 'es'}`
      : 'No especificado';

    const recommendedRange =
      quoteData.recommendedBudgetMin && quoteData.recommendedBudgetMax
        ? `${formatCurrency(quoteData.recommendedBudgetMin)} - ${formatCurrency(
            quoteData.recommendedBudgetMax
          )}`
        : 'No calculado';

    const safeName = escapeHtml(quoteData.name);
    const safeEmail = escapeHtml(quoteData.email);
    const safePhone = escapeHtml(quoteData.phone || 'No proporcionado');

    const subject = `Nueva solicitud de cotización - ${quoteData.name}`;
    
    const text = `
Nueva solicitud de cotización recibida:

Nombre: ${quoteData.name}
Email: ${quoteData.email}
Teléfono: ${quoteData.phone || 'No proporcionado'}
Presupuesto: ${formatCurrency(quoteData.budget)}
Tecnología: ${technologyLabels[quoteData.technology] || quoteData.technology}
Plazo solicitado: ${timelineLabel}
Rango estimado: ${recommendedRange}
Presión de plazo: ${quoteData.timelinePressure || 'No evaluado'}
Adecuación presupuestaria: ${quoteData.budgetAdequacy || 'No evaluada'}

Fecha: ${new Date().toLocaleString('es-CL')}
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; border-bottom: 2px solid #007ACC; padding-bottom: 10px;">
            Nueva Solicitud de Cotización
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Nombre:</strong> ${safeName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #007ACC;">${safeEmail}</a></p>
            <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${safePhone}</p>
            <p style="margin: 10px 0;"><strong>Presupuesto:</strong> <span style="color: #28a745; font-weight: bold;">${formatCurrency(quoteData.budget)}</span></p>
            <p style="margin: 10px 0;"><strong>Tecnología:</strong> ${technologyLabels[quoteData.technology] || quoteData.technology}</p>
            <p style="margin: 10px 0;"><strong>Plazo solicitado:</strong> ${timelineLabel}</p>
            <p style="margin: 10px 0;"><strong>Rango estimado:</strong> ${recommendedRange}</p>
            <p style="margin: 10px 0;"><strong>Presión de plazo:</strong> ${quoteData.timelinePressure || 'No evaluado'}</p>
            <p style="margin: 10px 0;"><strong>Adecuación presupuestaria:</strong> ${quoteData.budgetAdequacy || 'No evaluada'}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Fecha: ${new Date().toLocaleString('es-CL')}
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: quoteData.email,
      subject,
      text,
      html
    });
  }
}

export default MailgunService;
