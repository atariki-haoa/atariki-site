import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/functional/Layout';
import { useLanguage } from '../context/LanguageContext';

interface ContactFields {
  name: string;
  email: string;
  message: string;
}

type ContactErrors = Partial<Record<keyof ContactFields, boolean>>;

const ContactPage: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const [formStatus, setFormStatus] = useState<'form' | 'loading' | 'success'>('form');
  const [fields, setFields] = useState<ContactFields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Contáctame',
            description: 'Ponte en contacto con Ariel Lobos Haoa para proyectos y colaboraciones.',
            subtitle: 'Si tienes una consulta técnica o quieres conversar sobre un proyecto, completa el formulario o escríbeme a',
            name: 'Nombre',
            email: 'Correo Electrónico',
            message: 'Mensaje',
            errName: 'El nombre es obligatorio',
            errEmail: 'Ingresa un correo válido',
            errMessage: 'El mensaje no puede estar vacío',
            successMsg: 'Mensaje enviado correctamente.',
            sendAnother: 'Enviar otro mensaje',
            sending: 'Enviando...',
            send: 'Enviar',
            errorFallback: 'Error al enviar el mensaje. Inténtalo de nuevo más tarde.',
          }
        : {
            title: 'Get in Touch',
            description: 'Get in touch with Ariel Lobos Haoa for projects, collaborations, or inquiries.',
            subtitle: 'For a technical inquiry or to talk about a project, fill out the form or email me at',
            name: 'Name',
            email: 'Email',
            message: 'Message',
            errName: 'Name is required',
            errEmail: 'Enter a valid email',
            errMessage: 'Message cannot be empty',
            successMsg: 'Message sent successfully.',
            sendAnother: 'Send another message',
            sending: 'Sending...',
            send: 'Send',
            errorFallback: 'There was an error sending your message. Please try again later.',
          },
    [isSpanish]
  );

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf');
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  const handleChange = (field: keyof ContactFields, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ContactErrors = {};
    if (!fields.name.trim()) newErrors.name = true;
    if (!fields.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) newErrors.email = true;
    if (!fields.message.trim()) newErrors.message = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setFormStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(fields),
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken || '',
        },
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        setSubmitError(copy.errorFallback);
        setFormStatus('form');
      }
    } catch {
      setSubmitError(copy.errorFallback);
      setFormStatus('form');
    }
  };

  const resetContact = () => {
    setFormStatus('form');
    setFields({ name: '', email: '', message: '' });
    setErrors({});
    setSubmitError(null);
  };

  const fieldBorder = (field: keyof ContactFields) => (errors[field] ? 'border-term-red' : 'border-term-border');

  return (
    <Layout title={copy.title} description={copy.description} canonicalUrl="/contact">
      <main className="max-w-[560px] mx-auto px-6 py-16 pb-24">
        <h1 className="text-[30px] font-bold mb-3 text-center">{copy.title}</h1>
        <p className="text-term-muted text-[15px] text-center mb-8 leading-relaxed">
          {copy.subtitle}{' '}
          <a href="mailto:ariel@atariki.com" className="text-term-blue">
            ariel@atariki.com
          </a>
        </p>

        <div className="bg-term-panel border border-term-border rounded-2xl p-7">
          {formStatus === 'success' ? (
            <div className="text-center py-5">
              <div className="w-12 h-12 rounded-full bg-[#4ade8020] flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 20 20" stroke="#4ade80" strokeWidth={2.2} fill="none">
                  <polyline points="4 10 8 14 16 5" />
                </svg>
              </div>
              <p className="text-term-green font-semibold mb-5">{copy.successMsg}</p>
              <button
                onClick={resetContact}
                className="bg-term-panelAlt border border-term-border text-term-text px-5 py-2.5 rounded-lg text-[13px]"
              >
                {copy.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-[18px]">
                <label className="block text-[13px] text-term-sub mb-1.5">{copy.name}</label>
                <input
                  value={fields.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className={`w-full bg-term-panelAlt border ${fieldBorder('name')} text-term-text px-3.5 py-[11px] rounded-lg font-mono text-sm`}
                />
                {errors.name && <p className="text-term-red text-xs mt-1.5">{copy.errName}</p>}
              </div>

              <div className="mb-[18px]">
                <label className="block text-[13px] text-term-sub mb-1.5">{copy.email}</label>
                <input
                  type="email"
                  value={fields.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`w-full bg-term-panelAlt border ${fieldBorder('email')} text-term-text px-3.5 py-[11px] rounded-lg font-mono text-sm`}
                />
                {errors.email && <p className="text-term-red text-xs mt-1.5">{copy.errEmail}</p>}
              </div>

              <div className="mb-[22px]">
                <label className="block text-[13px] text-term-sub mb-1.5">{copy.message}</label>
                <textarea
                  value={fields.message}
                  onChange={e => handleChange('message', e.target.value)}
                  rows={5}
                  className={`w-full bg-term-panelAlt border ${fieldBorder('message')} text-term-text px-3.5 py-[11px] rounded-lg font-mono text-sm resize-y`}
                />
                {errors.message && <p className="text-term-red text-xs mt-1.5">{copy.errMessage}</p>}
              </div>

              {submitError && <p className="text-term-red text-[13px] mb-4 text-center">{submitError}</p>}

              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="w-full text-white py-[13px] rounded-[10px] font-semibold text-[14.5px]"
                style={{
                  background:
                    formStatus === 'loading' ? '#2d3a5c' : 'linear-gradient(120deg,#3f6fe0,#8b6ff0)',
                }}
              >
                {formStatus === 'loading' ? copy.sending : copy.send}
              </button>
            </form>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ContactPage;
