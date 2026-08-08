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
