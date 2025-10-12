export type QuoteTechnology = 'web_app' | 'integrations' | 'mobile_app' | 'other';

export interface QuoteInput {
  budget: number;
  technology: QuoteTechnology;
  timelineMonths: number;
}

export interface QuotePhase {
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
  complexity: 'Baja' | 'Media' | 'Alta';
  timelinePressure: 'Muy alta' | 'Alta' | 'Media' | 'Baja';
  budgetAdequacy: 'Ajustado' | 'Adecuado' | 'Amplio';
  phases: QuotePhase[];
  suggestions: string[];
  confidence: 'Alta' | 'Media' | 'Baja';
}

const MINIMUM_BUDGET = 1_000_000;

const phasesTemplate: Array<{ name: string; percentage: number }> = [
  { name: 'Descubrimiento y definición', percentage: 0.2 },
  { name: 'Diseño y UX', percentage: 0.15 },
  { name: 'Desarrollo e implementación', percentage: 0.45 },
  { name: 'QA y validaciones', percentage: 0.15 },
  { name: 'Despliegue y soporte inicial', percentage: 0.05 },
];

const technologyConfig: Record<
  QuoteTechnology,
  {
    baseComplexity: number;
    baseTimelineWeeks: number;
    suggestions: string[];
  }
> = {
  web_app: {
    baseComplexity: 1,
    baseTimelineWeeks: 10,
    suggestions: [
      'Esto sera un MVP, las funcionalidades avanzadas pueden quedar para fases posteriores.',
      'Reutilizar es la clave, entre mas funcionalidades que podamos reutilizar, mejor.',
      'Considera pruebas de usabilidad validadas previamente con alguna otra tecnología, ejemplo, excel, figma, etc.',
    ],
  },
  integrations: {
    baseComplexity: 1.3,
    baseTimelineWeeks: 14,
    suggestions: [
      'No es mucho tiempo, pero es suficiente para un proyecto bien acotado.',
      'Considera que solo tendremos 2 semanas para pruebas, asi que planifica en consecuencia.',
      'Si tiene integraciones, asegurate de tener las APIs bien documentadas y accesibles.',
    ],
  },
  mobile_app: {
    baseComplexity: 1.6,
    baseTimelineWeeks: 18,
    suggestions: [
      'Con este tiempo podemos hacer un buen MVP, pero no esperes funcionalidades muy complejas.',
      'Considera al menos 1 mes para pruebas y ajustes post-feedback inicial.',
      'Tendremos reuniones de seguimiento quincenales para asegurar que vamos por buen camino.',
    ],
  },
  other: {
    baseComplexity: 1.8,
    baseTimelineWeeks: 20,
    suggestions: [
      'La iteracion es la clave para proyectos complejos.',
      'Considera un MVP acotado antes de abordar personalizaciones complejas.',
      'Evalúa integrar monitoreo y alertas desde el inicio para reducir riesgos.',
    ],
  },
};

const timelineConfig = [
  { maxMonths: 1, multiplier: 1.6, pressure: 'Muy alta' as const },
  { maxMonths: 2, multiplier: 1.4, pressure: 'Muy alta' as const },
  { maxMonths: 3, multiplier: 1.2, pressure: 'Alta' as const },
  { maxMonths: 6, multiplier: 1.05, pressure: 'Media' as const },
  { maxMonths: 9, multiplier: 0.95, pressure: 'Baja' as const },
  { maxMonths: 12, multiplier: 0.9, pressure: 'Baja' as const },
  { maxMonths: Infinity, multiplier: 0.85, pressure: 'Baja' as const },
];

const roundToNearestThousand = (value: number) => Math.round(value / 1000) * 1000;

const clampTimelineMonths = (timelineMonths: number) => {
  const months = Number.isFinite(timelineMonths) ? timelineMonths : 1;
  return Math.min(Math.max(1, Math.round(months)), 24);
};

export const calculateQuoteEstimate = ({
  budget,
  technology,
  timelineMonths,
}: QuoteInput): QuoteEstimate => {
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

  const complexity =
    complexityScore < 1.3 ? 'Baja' : complexityScore < 1.6 ? 'Media' : 'Alta';

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
    Math.round(
      Math.max(baselineTimelineWeeks + timelineAdjustment, requestedTimelineWeeks)
    )
  );

  const budgetAdequacy =
    budgetAlignment < 0.9 ? 'Ajustado' : budgetAlignment > 1.3 ? 'Amplio' : 'Adecuado';

  let confidence: QuoteEstimate['confidence'] = 'Alta';

  if (normalizedTimelineMonths <= 2 || budgetAlignment < 0.75) {
    confidence = 'Media';
  }

  if (normalizedTimelineMonths <= 1 || budgetAlignment < 0.6) {
    confidence = 'Baja';
  }

  if (confidence !== 'Baja' && normalizedTimelineMonths >= 9 && budgetAlignment >= 1.2) {
    confidence = 'Alta';
  }

  const phases: QuotePhase[] = phasesTemplate.map(({ name, percentage }) => ({
    name,
    percentage,
    minAmount: roundToNearestThousand(recommendedMin * percentage),
    maxAmount: roundToNearestThousand(recommendedMax * percentage),
    averageAmount: roundToNearestThousand(recommendedMid * percentage),
  }));

  const suggestions = [
    ...tech.suggestions,
    ...(timelineProfile.pressure === 'Muy alta'
      ? [
          'Agenda reuniones de seguimiento semanales para controlar avance y desbloquear dependencias.',
          'Define un MVP muy acotado, la priorización será clave.',
        ]
      : timelineProfile.pressure === 'Alta'
      ? [
          'Priorizar es tu pastor, define un MVP claro y enfócate en eso.',
        ]
      : normalizedTimelineMonths >= 9
      ? [
          'Aca iteraremos, idealmente con un buen MVP inicial y luego iteraciones cortas.',
        ]
      : []),
    ...(budgetAdequacy === 'Ajustado'
      ? [
          'Revisa alcance y considera dividir funcionalidades avanzadas en hitos posteriores.',
          'Evalúa reutilizar assets existentes para mantener el presupuesto dentro de lo proyectado.',
        ]
      : budgetAdequacy === 'Amplio'
      ? ['Destina parte del presupuesto a QA automatizado y monitoreo en producción.']
      : []),
  ];

  return {
    requestedBudget: normalizedBudget,
    requestedTimelineMonths: normalizedTimelineMonths,
    recommendedBudget: {
      min: recommendedMin,
      max: recommendedMax,
    },
    recommendedTimelineWeeks,
    complexity,
    timelinePressure: timelineProfile.pressure,
    budgetAdequacy,
    phases,
    suggestions,
    confidence,
  };
};
