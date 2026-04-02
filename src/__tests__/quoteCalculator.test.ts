import { calculateQuoteEstimate, QuoteInput } from '../utils/quoteCalculator';

const baseInput: QuoteInput = {
  budget: 5_000_000,
  technology: 'web_app',
  timelineMonths: 3,
};

describe('calculateQuoteEstimate', () => {
  it('returns a valid estimate with default locale (es)', () => {
    const result = calculateQuoteEstimate(baseInput);
    expect(result.requestedBudget).toBeGreaterThanOrEqual(1_000_000);
    expect(result.recommendedBudget.min).toBeGreaterThan(0);
    expect(result.recommendedBudget.max).toBeGreaterThan(result.recommendedBudget.min);
    expect(result.phases).toHaveLength(5);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it('returns localized labels for es locale', () => {
    const result = calculateQuoteEstimate(baseInput, 'es');
    expect(['Baja', 'Media', 'Alta']).toContain(result.complexity);
    expect(['Baja', 'Media', 'Alta', 'Muy alta']).toContain(result.timelinePressure);
  });

  it('returns localized labels for en locale', () => {
    const result = calculateQuoteEstimate(baseInput, 'en');
    expect(['Low', 'Medium', 'High']).toContain(result.complexity);
    expect(['Low', 'Medium', 'High', 'Very high']).toContain(result.timelinePressure);
  });

  it('enforces minimum budget', () => {
    const result = calculateQuoteEstimate({ ...baseInput, budget: 100 });
    expect(result.requestedBudget).toBe(1_000_000);
  });

  it('clamps timeline to valid range', () => {
    const short = calculateQuoteEstimate({ ...baseInput, timelineMonths: 0 });
    expect(short.requestedTimelineMonths).toBe(1);

    const long = calculateQuoteEstimate({ ...baseInput, timelineMonths: 100 });
    expect(long.requestedTimelineMonths).toBe(24);
  });

  it('returns phases that sum to 100%', () => {
    const result = calculateQuoteEstimate(baseInput);
    const totalPercentage = result.phases.reduce((sum, p) => sum + p.percentage, 0);
    expect(totalPercentage).toBeCloseTo(1.0, 5);
  });

  it('handles all technology types', () => {
    const technologies = ['web_app', 'integrations', 'mobile_app', 'other'] as const;
    for (const tech of technologies) {
      const result = calculateQuoteEstimate({ ...baseInput, technology: tech });
      expect(result.recommendedBudget.min).toBeGreaterThan(0);
    }
  });

  it('returns higher pressure for short timelines', () => {
    const short = calculateQuoteEstimate({ ...baseInput, timelineMonths: 1 }, 'en');
    const long = calculateQuoteEstimate({ ...baseInput, timelineMonths: 12 }, 'en');
    const pressureOrder = ['Low', 'Medium', 'High', 'Very high'];
    expect(pressureOrder.indexOf(short.timelinePressure)).toBeGreaterThanOrEqual(
      pressureOrder.indexOf(long.timelinePressure)
    );
  });

  it('phase amounts are rounded to nearest thousand', () => {
    const result = calculateQuoteEstimate(baseInput);
    for (const phase of result.phases) {
      expect(phase.minAmount % 1000).toBe(0);
      expect(phase.maxAmount % 1000).toBe(0);
      expect(phase.averageAmount % 1000).toBe(0);
    }
  });
});
