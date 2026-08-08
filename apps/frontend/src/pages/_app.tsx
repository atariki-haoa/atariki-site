import '../styles/globals.css';
import App, { type AppContext, type AppProps } from 'next/app';
import type { IncomingMessage } from 'http';
import { LanguageProvider } from '../context/LanguageContext';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  type Locale,
  isSupportedLocale,
} from '../types/locale';
import { getCookieValue } from '../utils/cookies';

interface CustomPageProps {
  initialLocale?: Locale;
  [key: string]: unknown;
}

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  const { initialLocale = DEFAULT_LOCALE, ...restPageProps } = pageProps;

  return (
    <LanguageProvider initialLocale={initialLocale}>
      <Component {...(restPageProps as Record<string, unknown>)} />
    </LanguageProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  let initialLocale: Locale = DEFAULT_LOCALE;

  if (appContext.ctx.req) {
    const req = appContext.ctx.req as IncomingMessage & { preferredLocale?: string };
    if (req.preferredLocale && isSupportedLocale(req.preferredLocale)) {
      initialLocale = req.preferredLocale;
    } else {
      const cookieLocale = getCookieValue(appContext.ctx.req.headers?.cookie, LOCALE_COOKIE_NAME);
      if (isSupportedLocale(cookieLocale)) {
        initialLocale = cookieLocale;
      }
    }
  } else if (typeof document !== 'undefined') {
    const cookieLocale = getCookieValue(document.cookie, LOCALE_COOKIE_NAME);
    if (isSupportedLocale(cookieLocale)) {
      initialLocale = cookieLocale;
    }
  }

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      initialLocale,
    },
  };
};

export default MyApp;
