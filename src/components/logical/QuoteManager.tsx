import React, { useEffect, useMemo, useState } from 'react';
import QuoteForm, { type QuoteFormData } from '../ui/QuoteForm';
import { useLanguage } from '../../context/LanguageContext';
import type { QuoteEstimate } from '../../utils/quoteCalculator';

const QuoteManager: React.FC = () => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [quoteResult, setQuoteResult] = useState<QuoteEstimate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(isSpanish ? 'es-CL' : 'en-US', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
      }),
    [isSpanish]
  );

  const copy = useMemo(
    () =>
      isSpanish
        ? {
            successTitle: '¡Cotización Enviada!',
            successIntro:
              'Hemos generado una estimación inicial para tu proyecto. Aquí tienes un resumen de referencia.',
            budgetRangeTitle: 'Rango de presupuesto recomendado',
            budgetRangeText: (min: string, max: string) => `Entre ${min} y ${max}.`,
            cards: {
              complexity: 'Complejidad estimada',
              recommendedTimeline: 'Plazo recomendado',
              confidence: 'Confianza de la estimación',
              inputBudget: 'Presupuesto ingresado',
              requestedTimeline: 'Plazo solicitado',
              timelinePressure: 'Presión de plazo',
              budgetAdequacy: 'Adecuación presupuestaria',
            },
            phasesTitle: 'Distribución sugerida por fases',
            phaseAverageLabel: 'Promedio sugerido',
            suggestionsTitle: 'Próximos pasos sugeridos',
            resetButton: 'Enviar Otra Cotización',
            errorTitle: 'Error al Enviar',
            errorFallback:
              'Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos directamente.',
            retryButton: 'Intentar de Nuevo',
            notDefined: 'No definido',
          }
        : {
            successTitle: 'Estimate Sent!',
            successIntro:
              'We generated an initial estimate for your project. Here is a quick summary for reference.',
            budgetRangeTitle: 'Recommended budget range',
            budgetRangeText: (min: string, max: string) => `Between ${min} and ${max}.`,
            cards: {
              complexity: 'Estimated complexity',
              recommendedTimeline: 'Recommended timeline',
              confidence: 'Estimate confidence',
              inputBudget: 'Submitted budget',
              requestedTimeline: 'Requested timeline',
              timelinePressure: 'Timeline pressure',
              budgetAdequacy: 'Budget adequacy',
            },
            phasesTitle: 'Suggested phase distribution',
            phaseAverageLabel: 'Suggested average',
            suggestionsTitle: 'Suggested next steps',
            resetButton: 'Send Another Estimate',
            errorTitle: 'Submission Error',
            errorFallback:
              'We could not process your request. Please try again or reach out directly.',
            retryButton: 'Try Again',
            notDefined: 'Not defined',
          },
    [isSpanish]
  );

  const formatCurrency = (amount: number) => currencyFormatter.format(amount);

  const formatTimelineMonths = (months: number) => {
    if (!months) {
      return copy.notDefined;
    }

    if (months === 1) {
      return isSpanish ? '1 mes' : '1 month';
    }

    return isSpanish ? `${months} meses` : `${months} months`;
  };

  const formatRecommendedTimeline = (weeks: number) => {
    if (!weeks) {
      return copy.notDefined;
    }
    const approxMonths = Math.max(1, Math.round(weeks / 4));
    const weekLabel = isSpanish ? 'semana' : 'week';
    const monthLabel = isSpanish ? 'mes' : 'month';
    const weekText = `${weeks} ${weekLabel}${weeks === 1 ? '' : 's'}`;
    const monthText = `${approxMonths} ${monthLabel}${approxMonths === 1 ? '' : 's'}`;
    return `${weekText} (~${monthText})`;
  };

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf');
      const data = await response.json();
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

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
          'CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify({ ...data, locale }),
      });

      const payload = await response.json().catch(() => null);

      if (response.ok) {
        if (payload?.estimate) {
          setQuoteResult(payload.estimate as QuoteEstimate);
        }
        setSubmitStatus('success');
      } else {
        setErrorMessage(payload?.message || copy.errorFallback);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      setErrorMessage(copy.errorFallback);
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
            <h3 className="text-2xl font-bold text-green-400 mb-4">{copy.successTitle}</h3>
            <p className="text-gray-300 mb-6">{copy.successIntro}</p>

            {quoteResult && (
              <div className="text-left bg-gray-900/60 border border-green-500/50 rounded-2xl p-6 mb-6">
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-green-300">
                    {copy.budgetRangeTitle}
                  </h4>
                  <p className="text-gray-200 text-sm">
                    {copy.budgetRangeText(
                      formatCurrency(quoteResult.recommendedBudget.min),
                      formatCurrency(quoteResult.recommendedBudget.max)
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.complexity}</p>
                    <p className="text-lg font-semibold text-green-300">{quoteResult.complexity}</p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.recommendedTimeline}</p>
                    <p className="text-lg font-semibold text-green-300">
                      {formatRecommendedTimeline(quoteResult.recommendedTimelineWeeks)}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.confidence}</p>
                    <p className="text-lg font-semibold text-green-300">{quoteResult.confidence}</p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.inputBudget}</p>
                    <p className="text-lg font-semibold text-green-300">
                      {formatCurrency(quoteResult.requestedBudget)}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.requestedTimeline}</p>
                    <p className="text-lg font-semibold text-green-300">
                      {formatTimelineMonths(quoteResult.requestedTimelineMonths)}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.timelinePressure}</p>
                    <p className="text-lg font-semibold text-green-300">
                      {quoteResult.timelinePressure}
                    </p>
                  </div>
                  <div className="bg-green-900/30 rounded-xl p-4">
                    <p className="text-sm text-gray-400">{copy.cards.budgetAdequacy}</p>
                    <p className="text-lg font-semibold text-green-300">
                      {quoteResult.budgetAdequacy}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-green-300 mb-2">{copy.phasesTitle}</h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    {quoteResult.phases.map(phase => (
                      <li
                        key={phase.id}
                        className="flex justify-between bg-gray-800/60 rounded-lg px-3 py-2"
                      >
                        <span>{phase.name}</span>
                        <span className="flex flex-col items-end text-right">
                          <span>
                            {Math.round(phase.percentage * 100)}% · {formatCurrency(phase.minAmount)} -{' '}
                            {formatCurrency(phase.maxAmount)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {copy.phaseAverageLabel}: {formatCurrency(phase.averageAmount)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-green-300 mb-2">{copy.suggestionsTitle}</h4>
                  <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
                    {quoteResult.suggestions.map((suggestion, index) => (
                      <li key={`${index}-${suggestion}`}>{suggestion}</li>
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
              {copy.resetButton}
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
            <h3 className="text-2xl font-bold text-red-400 mb-4">{copy.errorTitle}</h3>
            <p className="text-gray-300 mb-6">{errorMessage || copy.errorFallback}</p>
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setQuoteResult(null);
                setErrorMessage(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {copy.retryButton}
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

  return <QuoteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};

export default QuoteManager;
