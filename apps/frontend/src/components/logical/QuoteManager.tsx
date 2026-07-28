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
          <div className="bg-term-panel border border-[#4ade8040] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#4ade8020] flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 20 20" stroke="#4ade80" strokeWidth={2.2} fill="none">
                <polyline points="4 10 8 14 16 5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-term-green mb-1.5">{copy.successTitle}</h3>
            <p className="text-term-sub text-[13.5px] mb-6">{copy.successIntro}</p>

            {quoteResult && (
              <div className="text-left bg-term-panelAlt rounded-xl p-6 mb-6">
                <div className="mb-4 text-center bg-term-terminal rounded-lg p-4">
                  <h4 className="text-xs text-term-dim mb-1">{copy.budgetRangeTitle}</h4>
                  <p className="text-term-green text-lg font-bold">
                    {copy.budgetRangeText(
                      formatCurrency(quoteResult.recommendedBudget.min),
                      formatCurrency(quoteResult.recommendedBudget.max)
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.complexity}</p>
                    <p className="text-sm font-semibold text-term-text">{quoteResult.complexity}</p>
                  </div>
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.recommendedTimeline}</p>
                    <p className="text-sm font-semibold text-term-text">
                      {formatRecommendedTimeline(quoteResult.recommendedTimelineWeeks)}
                    </p>
                  </div>
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.confidence}</p>
                    <p className="text-sm font-semibold text-term-text">{quoteResult.confidence}</p>
                  </div>
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.inputBudget}</p>
                    <p className="text-sm font-semibold text-term-text">
                      {formatCurrency(quoteResult.requestedBudget)}
                    </p>
                  </div>
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.requestedTimeline}</p>
                    <p className="text-sm font-semibold text-term-text">
                      {formatTimelineMonths(quoteResult.requestedTimelineMonths)}
                    </p>
                  </div>
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.timelinePressure}</p>
                    <p className="text-sm font-semibold text-term-text">{quoteResult.timelinePressure}</p>
                  </div>
                  <div className="bg-term-terminal rounded-lg p-3.5">
                    <p className="text-xs text-term-dim">{copy.cards.budgetAdequacy}</p>
                    <p className="text-sm font-semibold text-term-text">{quoteResult.budgetAdequacy}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[13px] font-semibold text-term-sub mb-2">{copy.phasesTitle}</p>
                  <ul className="space-y-1.5 text-[12.5px] text-term-sub">
                    {quoteResult.phases.map(phase => (
                      <li key={phase.id} className="flex justify-between bg-term-terminal rounded-lg px-3 py-2">
                        <span>{phase.name}</span>
                        <span className="flex flex-col items-end text-right">
                          <span>
                            {Math.round(phase.percentage * 100)}% · {formatCurrency(phase.minAmount)} -{' '}
                            {formatCurrency(phase.maxAmount)}
                          </span>
                          <span className="text-[11px] text-term-dim">
                            {copy.phaseAverageLabel}: {formatCurrency(phase.averageAmount)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-term-sub mb-2">{copy.suggestionsTitle}</p>
                  <ul className="list-disc list-inside text-[12.5px] text-term-sub space-y-1">
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
              className="bg-term-panelAlt border border-term-border text-term-text font-semibold py-3 px-6 rounded-lg text-[13px]"
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
          <div className="bg-term-panel border border-[#f8717140] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f8717120] flex items-center justify-center mx-auto mb-4 text-term-red text-2xl">
              ✗
            </div>
            <h3 className="text-xl font-bold text-term-red mb-1.5">{copy.errorTitle}</h3>
            <p className="text-term-sub text-[13.5px] mb-6">{errorMessage || copy.errorFallback}</p>
            <button
              onClick={() => {
                setSubmitStatus('idle');
                setQuoteResult(null);
                setErrorMessage(null);
              }}
              className="bg-term-panelAlt border border-term-border text-term-text font-semibold py-3 px-6 rounded-lg text-[13px]"
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
