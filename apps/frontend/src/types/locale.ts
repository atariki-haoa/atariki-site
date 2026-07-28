import config from '../locales/config.json';

const { supportedLocales, defaultLocale, localeCookieName } = config;

export type Locale = (typeof supportedLocales)[number];

export const SUPPORTED_LOCALES = supportedLocales as Locale[];

export const DEFAULT_LOCALE = defaultLocale as Locale;

export const LOCALE_COOKIE_NAME = localeCookieName as string;

export const isSupportedLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale);
