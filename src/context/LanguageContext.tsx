import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
  type Locale,
  isSupportedLocale,
} from '../types/locale';
import { getCookieValue } from '../utils/cookies';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (nextLocale: Locale, options?: { persist?: boolean }) => void;
  toggleLocale: () => void;
  availableLocales: Locale[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  initialLocale?: Locale;
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  initialLocale = DEFAULT_LOCALE,
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>(
    isSupportedLocale(initialLocale) ? initialLocale : DEFAULT_LOCALE
  );

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const cookieLocale = getCookieValue(document.cookie, LOCALE_COOKIE_NAME);
    if (isSupportedLocale(cookieLocale) && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
  }, [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale, options: { persist?: boolean } = {}) => {
      if (!isSupportedLocale(nextLocale)) {
        return;
      }

      setLocaleState(nextLocale);

      if (typeof document === 'undefined') {
        return;
      }

      if (options.persist === false) {
        return;
      }

      document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    },
    []
  );

  const toggleLocale = useCallback(() => {
    if (SUPPORTED_LOCALES.length < 2) {
      return;
    }
    const currentIndex = SUPPORTED_LOCALES.indexOf(locale);
    const nextLocale = SUPPORTED_LOCALES[(currentIndex + 1) % SUPPORTED_LOCALES.length];
    setLocale(nextLocale);
  }, [locale, setLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      availableLocales: SUPPORTED_LOCALES,
    }),
    [locale, setLocale, toggleLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
