import React, { useState } from 'react';
import QuoteForm from '../ui/QuoteForm';

interface QuoteFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  technology: string;
  timeline: string;
}

interface QuotePhase {
  name: string;
  percentage: number;
  minAmount: number;
  maxAmount: number;
  averageAmount: number;
}

interface QuoteEstimate {
  requestedBudget: number;
  requestedTimelineMonths: number;
  recommendedBudget: {
    min: number;
    max: number;
  };
  recommendedTimelineWeeks: number;
  complexity: 'Baja' | 'Media' | 'Alta';
  timelinePressure: 'Muy alta' | 'Alta' | 'Media' | 'Baja';
  budgetAdequacy: 'Ajustado' | 'Adecuado' | 'Amplio';
  phases: QuotePhase[];
  suggestions: string[];
  confidence: 'Alta' | 'Media' | 'Baja';
}

const QuoteManager: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [quoteResult, setQuoteResult] = useState<QuoteEstimate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeline = (months: number) => {
    if (!months) return 'No definido';
    return `${months} mes${months === 1 ? '' : 'es'}`;
  };

  const formatRecommendedTimeline = (weeks: number) => {
    if (!weeks) return 'No definido';
    const approxMonths = Math.max(1, Math.round(weeks / 4));
    return `${weeks} semana${weeks === 1 ? '' : 's'} (~${approxMonths} mes${approxMonths === 1 ? '' : 'es'})`;
  };

  const handleSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setQuoteResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const payload = await response.json().catch(() => null);

      if (response.ok) {
        if (payload?.estimate) {
          setQuoteResult(payload.estimate);
        }
        setSubmitStatus('success');
      } else {
        setErrorMessage(payload?.message || 'No se pudo generar la cotización.');
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      setErrorMessage('Ocurrió un error inesperado al enviar la cotización.');
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
              Hemos generado una estimación inicial para tu proyecto. Aquí tienes un resumen de referencia.
            </p>

            {quoteResult && (
              <div className="text-left bg-gray-900/60 border border-green-500/50 rounded-2xl p-6 mb-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-green-300">
                    Rango de presupuesto recomendado
                  </h4>
                  <p className="text-gray-200 text-sm">
                    Entre{' '}
                    <span className="font-semibold">
                      {formatCurrency(quoteResult.recommendedBudget.min)}
                    </span>{' '}
                    y{' '}
                    <span className="font-semibold">
                      {formatCurrency(quoteResult.recommendedBudget.max)}
                    </span>
                    .
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Complejidad estimada</p>
                    <p className="text-lg font-semibold text-green-300">
                      {quoteResult.complexity}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Plazo recomendado</p>
                    <p className="text-lg font-semibold text-green-300">
                      {formatRecommendedTimeline(quoteResult.recommendedTimelineWeeks)}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Confianza de la estimación</p>
                    <p className="text-lg font-semibold text-green-300">
                      {quoteResult.confidence}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Presupuesto ingresado</p>
                    <p className="text-lg font-semibold text-green-300">
                      {formatCurrency(quoteResult.requestedBudget)}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Plazo solicitado</p>
                    <p className="text-lg font-semibold text-green-300">
                      {formatTimeline(quoteResult.requestedTimelineMonths)}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Presión de plazo</p>
                    <p className="text-lg font-semibold text-green-300">
                      {quoteResult.timelinePressure}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">Adecuación presupuestaria</p>
                    <p className="text-lg font-semibold text-green-300">
                      {quoteResult.budgetAdequacy}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-2">
                    Distribución sugerida por fases
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    {quoteResult.phases.map((phase) => (
                      <li
                        key={phase.name}
                        className="flex justify-between bg-gray-800/60 rounded-lg px-3 py-2"
                      >
                        <span>{phase.name}</span>
                        <span className="flex flex-col items-end text-right">
                          <span>
                            {Math.round(phase.percentage * 100)}% ·{' '}
                            {formatCurrency(phase.minAmount)} - {formatCurrency(phase.maxAmount)}
                          </span>
                          <span className="text-xs text-gray-400">
                            Promedio sugerido: {formatCurrency(phase.averageAmount)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-green-300 mb-2">
                    Próximos pasos sugeridos
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                    {quoteResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSubmitStatus('idle');
                setQuoteResult(null);
                setErrorMessage(null);
              }}
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
              {errorMessage ||
                'Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos directamente.'}
            </p>
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setQuoteResult(null);
                setErrorMessage(null);
              }}
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
      isSubmitting={isSubmitting}
    />
  );
};

export default QuoteManager;
