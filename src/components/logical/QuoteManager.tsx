import React, { useState } from 'react';
import QuoteForm from '../ui/QuoteForm';

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
}

const QuoteManager: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusMessage = () => {
    if (submitStatus === 'success') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-green-800 bg-opacity-50 border border-green-500 rounded-3xl shadow-lg p-8 text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              ¡Cotización Enviada!
            </h3>
            <p className="text-gray-300 mb-6">
              Hemos recibido tu solicitud de cotización. Te contactaremos pronto con una propuesta detallada.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Enviar Otra Cotización
            </button>
          </div>
        </div>
      );
    }

    if (submitStatus === 'error') {
      return (
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-red-800 bg-opacity-50 border border-red-500 rounded-3xl shadow-lg p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">✗</div>
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              Error al Enviar
            </h3>
            <p className="text-gray-300 mb-6">
              Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos directamente.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Intentar de Nuevo
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  if (submitStatus !== 'idle') {
    return renderStatusMessage();
  }

  return (
    <QuoteForm 
      onSubmit={handleSubmit}
    />
  );
};

export default QuoteManager;
