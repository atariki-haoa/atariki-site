import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/functional/Layout';
import { useLanguage } from '../context/LanguageContext';

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            title: 'Contacto - Ariel Lobos Haoa',
            description: 'Ponte en contacto con Ariel Lobos Haoa para proyectos y colaboraciones.',
            heading: 'Contáctame',
            intro:
              'Si tienes una consulta técnica, necesitas conversar sobre un proyecto o solicitar una cotización, completa el formulario o escríbeme a',
            nameLabel: 'Nombre:',
            emailLabel: 'Correo Electrónico:',
            messageLabel: 'Mensaje:',
            submit: 'Enviar',
            success: 'Correo enviado correctamente.',
            error: 'Error al enviar el correo. Inténtalo de nuevo más tarde.',
          }
        : {
            title: 'Contact - Ariel Lobos Haoa',
            description: 'Get in touch with Ariel Lobos Haoa for projects, collaborations, or inquiries.',
            heading: 'Contact Me',
            intro:
              'If you have a technical question, want to discuss a project, or request a quote, fill out the form or email me at',
            nameLabel: 'Name:',
            emailLabel: 'Email:',
            messageLabel: 'Message:',
            submit: 'Send',
            success: 'Email sent successfully.',
            error: 'There was an error sending your message. Please try again later.',
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData.entries())),
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken || '',
        },
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <Layout title={copy.title} description={copy.description} canonicalUrl="/contact">
      <div className="relative mt-8">
        <div className="max-w-lg mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-100 mb-4">{copy.heading}</h2>
          <p className="text-gray-300 mb-6">
            {copy.intro}{' '}
            <a href="mailto:ariel@atariki.com" className="text-blue-400 underline">
              ariel@atariki.com
            </a>
          </p>
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="_csrf" value={csrfToken || ''} />
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-300">
                {copy.nameLabel}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300">
                {copy.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-300">
                {copy.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-300 rounded-md"
                rows={5}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              {copy.submit}
            </button>
          </form>
        </div>

        {status && (
          <div
            className={`fixed inset-0 flex items-center justify-center transition-opacity duration-300 ${
              status ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm mx-auto animate-popup">
              {loading ? (
                <div className="loader"></div>
              ) : status === 'success' ? (
                <p className="text-green-500">{copy.success}</p>
              ) : (
                <p className="text-red-500">{copy.error}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContactPage;
