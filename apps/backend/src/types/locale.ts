export type Locale = 'es' | 'en';

export const DEFAULT_LOCALE: Locale = 'es';

export const isSupportedLocale = (value: unknown): value is Locale =>
  value === 'es' || value === 'en';
