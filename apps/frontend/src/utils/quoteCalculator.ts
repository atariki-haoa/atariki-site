import type { Locale } from '../types/locale';

export type QuoteTechnology = 'web_app' | 'integrations' | 'mobile_app' | 'other';

export interface QuoteInput {
  budget: number;
  technology: QuoteTechnology;
  timelineMonths: number;
}

export interface QuotePhase {
  id: string;
  name: string;
  percentage: number;
  minAmount: number;
  maxAmount: number;
  averageAmount: number;
}

export interface QuoteEstimate {
  requestedBudget: number;
  requestedTimelineMonths: number;
  recommendedBudget: {
    min: number;
    max: number;
  };
  recommendedTimelineWeeks: number;
  complexity: string;
  timelinePressure: string;
  budgetAdequacy: string;
  phases: QuotePhase[];
  suggestions: string[];
  confidence: string;
}

const MINIMUM_BUDGET = 1_000_000;

const COMPLEXITY_LABELS: Record<Locale, Record<'low' | 'medium' | 'high', string>> = {
  es: { low: 'Baja', medium: 'Media', high: 'Alta' },
  en: { low: 'Low', medium: 'Medium', high: 'High' },
};

const PRESSURE_LABELS: Record<Locale, Record<'very_high' | 'high' | 'medium' | 'low', string>> = {
  es: {
    very_high: 'Muy alta',
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  },
  en: {
    very_high: 'Very high',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
};

const BUDGET_ADEQUACY_LABELS: Record<Locale, Record<'tight' | 'adequate' | 'ample', string>> = {
  es: {
    tight: 'Ajustado',
    adequate: 'Adecuado',
    ample: 'Amplio',
  },
  en: {
    tight: 'Tight',
    adequate: 'Adequate',
    ample: 'Ample',
  },
};

const CONFIDENCE_LABELS: Record<Locale, Record<'low' | 'medium' | 'high', string>> = {
  es: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  },
  en: {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  },
};

const phasesTemplate: Array<{
  id: string;
  percentage: number;
  name: Record<Locale, string>;
}> = [
  {
    id: 'discovery',
    percentage: 0.2,
    name: {
      es: 'Descubrimiento y definición',
      en: 'Discovery & Definition',
    },
  },
  {
    id: 'design',
    percentage: 0.15,
    name: {
      es: 'Diseño y UX',
      en: 'Design & UX',
    },
  },
  {
    id: 'development',
    percentage: 0.45,
    name: {
      es: 'Desarrollo e implementación',
      en: 'Development & Implementation',
    },
  },
  {
    id: 'qa',
    percentage: 0.15,
    name: {
      es: 'QA y validaciones',
      en: 'QA & Validation',
    },
  },
  {
    id: 'launch',
    percentage: 0.05,
    name: {
      es: 'Despliegue y soporte inicial',
      en: 'Launch & Initial Support',
    },
  },
];

const technologyConfig: Record<
  QuoteTechnology,
  {
    baseComplexity: number;
    baseTimelineWeeks: number;
    suggestions: Record<Locale, string[]>;
  }
> = {
  web_app: {
    baseComplexity: 1,
    baseTimelineWeeks: 10,
    suggestions: {
      es: [
        'Esto será un MVP, las funcionalidades avanzadas pueden quedar para fases posteriores.',
        'Reutilizar componentes y librerías existentes ayudará a mantener el alcance controlado.',
        'Considera validar la experiencia con prototipos rápidos (Excel, Figma, etc.) antes del desarrollo.',
      ],
      en: [
        'Treat this as an MVP; advanced features can move into later phases.',
        'Favor reusing existing components and libraries to keep scope under control.',
        'Validate usability with quick prototypes (Excel, Figma, etc.) before building features.',
      ],
    },
  },
  integrations: {
    baseComplexity: 1.3,
    baseTimelineWeeks: 14,
    suggestions: {
      es: [
        'El tiempo es acotado pero suficiente para un proyecto bien definido.',
        'Solo contaremos con 2 semanas para pruebas, planifica la disponibilidad de ambientes.',
        'Asegúrate de que las APIs estén documentadas y accesibles desde el inicio.',
      ],
      en: [
        'The timeline is tight but sufficient for a well-scoped project.',
        'We will only have 2 weeks for testing; secure environments ahead of time.',
        'Make sure all APIs are documented and accessible from day one.',
      ],
    },
  },
  mobile_app: {
    baseComplexity: 1.6,
    baseTimelineWeeks: 18,
    suggestions: {
      es: [
        'Con este tiempo lograremos un buen MVP, evita funcionalidades demasiado complejas al inicio.',
        'Reserva al menos 1 mes para pruebas y ajustes tras el primer feedback.',
        'Programa reuniones de seguimiento cada dos semanas para mantener alineación.',
      ],
      en: [
        'This timeframe supports a solid MVP; keep advanced features for later iterations.',
        'Allocate at least 1 month for testing and adjustments after the first feedback round.',
        'Schedule bi-weekly follow-ups to keep the roadmap aligned.',
      ],
    },
  },
  other: {
    baseComplexity: 1.8,
    baseTimelineWeeks: 20,
    suggestions: {
      es: [
        'La iteración continua es clave para proyectos complejos.',
        'Prioriza un MVP acotado antes de implementar personalizaciones avanzadas.',
        'Integra monitoreo y alertas desde el inicio para reducir riesgos.',
      ],
      en: [
        'Iterative delivery is essential for complex initiatives.',
        'Prioritize a focused MVP before investing in extensive customizations.',
        'Introduce monitoring and alerting from the start to reduce operational risk.',
      ],
    },
  },
};

const timelineConfig: Array<{
  maxMonths: number;
  multiplier: number;
  pressure: 'very_high' | 'high' | 'medium' | 'low';
}> = [
  { maxMonths: 1, multiplier: 1.6, pressure: 'very_high' },
  { maxMonths: 2, multiplier: 1.4, pressure: 'very_high' },
  { maxMonths: 3, multiplier: 1.2, pressure: 'high' },
  { maxMonths: 6, multiplier: 1.05, pressure: 'medium' },
  { maxMonths: 9, multiplier: 0.95, pressure: 'low' },
  { maxMonths: 12, multiplier: 0.9, pressure: 'low' },
  { maxMonths: Infinity, multiplier: 0.85, pressure: 'low' },
];

const TIMELINE_SUGGESTIONS: Record<
  'very_high' | 'high' | 'long',
  Record<Locale, string[]>
> = {
  very_high: {
    es: [
      'Agenda reuniones semanales para monitorear avance y desbloquear dependencias a tiempo.',
      'Define un MVP muy acotado; la priorización será clave para cumplir plazos.',
    ],
    en: [
      'Schedule weekly check-ins to track progress and unblock dependencies quickly.',
      'Define a very focused MVP; ruthless prioritization will keep the timeline realistic.',
    ],
  },
  high: {
    es: ['La priorización es clave: define un MVP claro y enfócate en lo esencial.'],
    en: ['Prioritize aggressively: define a clear MVP and focus on essentials.'],
  },
  long: {
    es: ['Planifica iteraciones cortas luego del MVP inicial para capitalizar el aprendizaje.'],
    en: ['Plan short iterations after the initial MVP to capitalize on learning.'],
  },
};

const BUDGET_SUGGESTIONS: Record<'tight' | 'ample', Record<Locale, string[]>> = {
  tight: {
    es: [
      'Revisa el alcance y considera dividir funcionalidades avanzadas en fases posteriores.',
      'Reutiliza activos existentes para mantener el presupuesto dentro de lo proyectado.',
    ],
    en: [
      'Review scope and consider moving advanced features to later phases.',
      'Reuse existing assets wherever possible to stay within the projected budget.',
    ],
  },
  ample: {
    es: ['Destina parte del presupuesto a QA automatizado y monitoreo en producción.'],
    en: ['Invest part of the budget in automated QA and production monitoring.'],
  },
};

const roundToNearestThousand = (value: number) => Math.round(value / 1000) * 1000;

const clampTimelineMonths = (timelineMonths: number) => {
  const months = Number.isFinite(timelineMonths) ? timelineMonths : 1;
  return Math.min(Math.max(1, Math.round(months)), 24);
};

export const calculateQuoteEstimate = (
  { budget, technology, timelineMonths }: QuoteInput,
  locale: Locale = 'es'
): QuoteEstimate => {
  const isSpanish = locale === 'es';

  const normalizedBudget = Math.max(MINIMUM_BUDGET, budget || MINIMUM_BUDGET);
  const normalizedTimelineMonths = clampTimelineMonths(timelineMonths);

  const tech = technologyConfig[technology];
  const timelineProfile =
    timelineConfig.find(({ maxMonths }) => normalizedTimelineMonths <= maxMonths) ??
    timelineConfig[timelineConfig.length - 1];

  const baseCost = MINIMUM_BUDGET * tech.baseComplexity * 1.15;
  const targetCost = baseCost * timelineProfile.multiplier;
  const budgetAlignment = normalizedBudget / targetCost;

  let complexityScore = tech.baseComplexity;
  complexityScore += (timelineProfile.multiplier - 1) * 0.9;

  if (budgetAlignment > 1.4 && normalizedTimelineMonths <= 3) {
    complexityScore += 0.3;
  } else if (budgetAlignment < 0.75 && normalizedTimelineMonths >= 9) {
    complexityScore -= 0.1;
  }

  if (budgetAlignment < 0.65) {
    complexityScore += 0.2;
  }

  if (normalizedTimelineMonths <= 2) {
    complexityScore += 0.15;
  } else if (normalizedTimelineMonths >= 12 && budgetAlignment >= 1.2) {
    complexityScore -= 0.1;
  }

  const complexityKey: 'low' | 'medium' | 'high' =
    complexityScore < 1.3 ? 'low' : complexityScore < 1.6 ? 'medium' : 'high';

  let recommendedCore = targetCost;

  if (budgetAlignment < 0.85) {
    recommendedCore *= 1.12;
  } else if (budgetAlignment > 1.35) {
    recommendedCore *= 1.05;
  }

  const recommendedMin = roundToNearestThousand(
    Math.max(MINIMUM_BUDGET, recommendedCore * 0.9)
  );

  let recommendedMax = roundToNearestThousand(
    Math.max(recommendedMin + 100000, recommendedCore * 1.25)
  );

  if (budgetAlignment > 1.4) {
    recommendedMax = roundToNearestThousand(Math.max(recommendedMax, normalizedBudget * 0.9));
  }

  if (budgetAlignment < 0.8) {
    recommendedMax = roundToNearestThousand(Math.max(recommendedMax, recommendedCore * 1.35));
  }

  const recommendedMid = (recommendedMin + recommendedMax) / 2;

  const baselineTimelineWeeks = tech.baseTimelineWeeks;
  const requestedTimelineWeeks = normalizedTimelineMonths * 4;

  const timelineAdjustment =
    normalizedTimelineMonths <= 2
      ? baselineTimelineWeeks * 0.45
      : normalizedTimelineMonths <= 3
      ? baselineTimelineWeeks * 0.25
      : normalizedTimelineMonths <= 6
      ? baselineTimelineWeeks * 0.1
      : normalizedTimelineMonths <= 9
      ? -baselineTimelineWeeks * 0.1
      : normalizedTimelineMonths <= 12
      ? -baselineTimelineWeeks * 0.15
      : -baselineTimelineWeeks * 0.2;

  const recommendedTimelineWeeks = Math.max(
    4,
    Math.round(Math.max(baselineTimelineWeeks + timelineAdjustment, requestedTimelineWeeks))
  );

  const budgetAdequacyKey: 'tight' | 'adequate' | 'ample' =
    budgetAlignment < 0.9 ? 'tight' : budgetAlignment > 1.3 ? 'ample' : 'adequate';

  let confidenceKey: 'low' | 'medium' | 'high' = 'high';

  if (normalizedTimelineMonths <= 2 || budgetAlignment < 0.75) {
    confidenceKey = 'medium';
  }

  if (normalizedTimelineMonths <= 1 || budgetAlignment < 0.6) {
    confidenceKey = 'low';
  }

  if (confidenceKey !== 'low' && normalizedTimelineMonths >= 9 && budgetAlignment >= 1.2) {
    confidenceKey = 'high';
  }

  const phases: QuotePhase[] = phasesTemplate.map(({ id, percentage, name }) => ({
    id,
    name: name[locale],
    percentage,
    minAmount: roundToNearestThousand(recommendedMin * percentage),
    maxAmount: roundToNearestThousand(recommendedMax * percentage),
    averageAmount: roundToNearestThousand(recommendedMid * percentage),
  }));

  const suggestions: string[] = [];

  suggestions.push(...tech.suggestions[locale]);

  if (timelineProfile.pressure === 'very_high') {
    suggestions.push(...TIMELINE_SUGGESTIONS.very_high[locale]);
  } else if (timelineProfile.pressure === 'high') {
    suggestions.push(...TIMELINE_SUGGESTIONS.high[locale]);
  } else if (normalizedTimelineMonths >= 9) {
    suggestions.push(...TIMELINE_SUGGESTIONS.long[locale]);
  }

  if (budgetAdequacyKey === 'tight') {
    suggestions.push(...BUDGET_SUGGESTIONS.tight[locale]);
  } else if (budgetAdequacyKey === 'ample') {
    suggestions.push(...BUDGET_SUGGESTIONS.ample[locale]);
  }

  return {
    requestedBudget: normalizedBudget,
    requestedTimelineMonths: normalizedTimelineMonths,
    recommendedBudget: {
      min: recommendedMin,
      max: recommendedMax,
    },
    recommendedTimelineWeeks,
    complexity: COMPLEXITY_LABELS[locale][complexityKey],
    timelinePressure: PRESSURE_LABELS[locale][timelineProfile.pressure],
    budgetAdequacy: BUDGET_ADEQUACY_LABELS[locale][budgetAdequacyKey],
    phases,
    suggestions,
    confidence: CONFIDENCE_LABELS[locale][confidenceKey],
  };
};
