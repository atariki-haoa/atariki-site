import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuoteEstimate, type QuoteInput } from '../services/quoteCalculator.js';

const baseInput: QuoteInput = {
  budget: 5_000_000,
  technology: 'web_app',
  timelineMonths: 3,
};

describe('calculateQuoteEstimate', () => {
  it('returns a valid estimate with default locale (es)', () => {
    const result = calculateQuoteEstimate(baseInput);
    assert.ok(result.requestedBudget >= 1_000_000);
    assert.ok(result.recommendedBudget.min > 0);
    assert.ok(result.recommendedBudget.max > result.recommendedBudget.min);
    assert.strictEqual(result.phases.length, 5);
    assert.ok(result.suggestions.length > 0);
  });

  it('returns localized labels for es locale', () => {
    const result = calculateQuoteEstimate(baseInput, 'es');
    assert.ok(['Baja', 'Media', 'Alta'].includes(result.complexity));
    assert.ok(['Baja', 'Media', 'Alta', 'Muy alta'].includes(result.timelinePressure));
  });

  it('returns localized labels for en locale', () => {
    const result = calculateQuoteEstimate(baseInput, 'en');
    assert.ok(['Low', 'Medium', 'High'].includes(result.complexity));
    assert.ok(['Low', 'Medium', 'High', 'Very high'].includes(result.timelinePressure));
  });

  it('enforces minimum budget', () => {
    const result = calculateQuoteEstimate({ ...baseInput, budget: 100 });
    assert.strictEqual(result.requestedBudget, 1_000_000);
  });

  it('clamps timeline to valid range', () => {
    const short = calculateQuoteEstimate({ ...baseInput, timelineMonths: 0 });
    assert.strictEqual(short.requestedTimelineMonths, 1);

    const long = calculateQuoteEstimate({ ...baseInput, timelineMonths: 100 });
    assert.strictEqual(long.requestedTimelineMonths, 24);
  });

  it('returns phases that sum to 100%', () => {
    const result = calculateQuoteEstimate(baseInput);
    const totalPercentage = result.phases.reduce((sum, p) => sum + p.percentage, 0);
    assert.ok(Math.abs(totalPercentage - 1.0) < 1e-9);
  });

  it('handles all technology types', () => {
    const technologies = ['web_app', 'integrations', 'mobile_app', 'other'] as const;
    for (const tech of technologies) {
      const result = calculateQuoteEstimate({ ...baseInput, technology: tech });
      assert.ok(result.recommendedBudget.min > 0);
    }
  });

  it('returns higher pressure for short timelines', () => {
    const short = calculateQuoteEstimate({ ...baseInput, timelineMonths: 1 }, 'en');
    const long = calculateQuoteEstimate({ ...baseInput, timelineMonths: 12 }, 'en');
    const pressureOrder = ['Low', 'Medium', 'High', 'Very high'];
    assert.ok(
      pressureOrder.indexOf(short.timelinePressure) >= pressureOrder.indexOf(long.timelinePressure)
    );
  });

  it('phase amounts are rounded to nearest thousand', () => {
    const result = calculateQuoteEstimate(baseInput);
    for (const phase of result.phases) {
      assert.strictEqual(phase.minAmount % 1000, 0);
      assert.strictEqual(phase.maxAmount % 1000, 0);
      assert.strictEqual(phase.averageAmount % 1000, 0);
    }
  });
});
