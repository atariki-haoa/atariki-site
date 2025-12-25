require('dotenv').config();

const express = require('express');
const next = require('next');
const csrf = require('csrf');
const cookieParser = require('cookie-parser');
const { detectLocale } = require('./src/server/detectLocale');
const localeConfig = require('./src/locales/config.json');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configurar middleware para parsear cookies
  server.use(cookieParser());

  // Detección de idioma basada en IP y cabeceras
  server.use(async (req, res, next) => {
    const cookieName = localeConfig.localeCookieName || 'preferredLocale';
    const supportedLocales = new Set(localeConfig.supportedLocales || ['es', 'en']);
    const secureCookie = process.env.NODE_ENV === 'production';
    const fallbackLocale = localeConfig.defaultLocale || 'es';

    try {
      const cookieLocale = req.cookies?.[cookieName];
      let resolvedLocale = supportedLocales.has(cookieLocale) ? cookieLocale : undefined;

      if (!resolvedLocale) {
        resolvedLocale = await detectLocale(req);
        if (!supportedLocales.has(resolvedLocale)) {
          resolvedLocale = fallbackLocale;
        }
        res.cookie(cookieName, resolvedLocale, {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          sameSite: 'lax',
          httpOnly: false,
          secure: secureCookie,
        });
      }

      req.preferredLocale = resolvedLocale;
      res.locals.preferredLocale = resolvedLocale;
      next();
    } catch (error) {
      console.error('[locale] Error al detectar idioma:', error);
      const resolvedLocale = fallbackLocale;
      req.preferredLocale = resolvedLocale;
      res.locals.preferredLocale = resolvedLocale;
      res.cookie(cookieName, resolvedLocale, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'lax',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      });
      next();
    }
  });

  // Configurar CSRF
  const csrfProtection = csrf();
  const csrfSecret = process.env.CSRF_SECRET || csrfProtection.secretSync();

  // Middleware para generar y validar tokens CSRF
  server.use((req, res, next) => {
    let secret = req.cookies?._csrf;
    if (!secret) {
      secret = csrfSecret;
      res.cookie('_csrf', secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    req.csrfToken = () => csrfProtection.create(secret);
    next();
  });

  // Middleware de validación CSRF para rutas POST/PUT/DELETE
  server.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const secret = req.cookies?._csrf || csrfSecret;
      const token = req.headers['csrf-token'] || req.headers['x-csrf-token'] || req.body?._csrf;
      
      if (!secret || !token || !csrfProtection.verify(secret, token)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }
    }
    next();
  });

  // Ruta para obtener el token CSRF
  server.get('/api/csrf', (req, res) => {
    const secret = req.cookies?._csrf || csrfSecret;
    const token = csrfProtection.create(secret);
    res.json({ csrfToken: token });
  });

  // Manejar todas las demás rutas con Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
