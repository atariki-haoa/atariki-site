const axios = require('axios');
const config = require('../locales/config.json');

const SPANISH_COUNTRY_SET = new Set(
  (config.spanishCountryCodes || []).map((code) => code.toUpperCase())
);
const SUPPORTED_LOCALES = new Set(config.supportedLocales || ['es', 'en']);
const DEFAULT_LOCALE = config.defaultLocale || 'es';
const LOCALE_COOKIE_NAME = config.localeCookieName || 'preferredLocale';

const GEOLOCATION_API_BASE_URL = process.env.GEOLOCATION_API_BASE_URL || 'https://ipapi.co';

const IPV4_PRIVATE_REGEX =
  /^(127\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.)/;
const IPV6_PRIVATE_REGEX =
  /^(::1$)|(^fc)|(^fd)/i;

const normalizeIp = (ip) => {
  if (!ip) {
    return '';
  }
  // Remove IPv6 prefix if present (e.g. ::ffff:192.168.0.1)
  if (ip.includes('::ffff:')) {
    return ip.split('::ffff:').pop();
  }
  return ip;
};

const isPrivateIp = (ip) => {
  if (!ip) {
    return true;
  }

  if (IPV4_PRIVATE_REGEX.test(ip)) {
    return true;
  }

  if (IPV6_PRIVATE_REGEX.test(ip)) {
    return true;
  }

  return false;
};

const extractIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    const [forwardedIp] = forwardedFor.split(',').map((part) => part.trim());
    const normalizedForwarded = normalizeIp(forwardedIp);
    if (normalizedForwarded) {
      return normalizedForwarded;
    }
  }

  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (typeof cfConnectingIp === 'string' && cfConnectingIp.length > 0) {
    return normalizeIp(cfConnectingIp);
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) {
    return normalizeIp(realIp);
  }

  if (typeof req.ip === 'string') {
    return normalizeIp(req.ip);
  }

  if (req.connection && typeof req.connection.remoteAddress === 'string') {
    return normalizeIp(req.connection.remoteAddress);
  }

  return '';
};

const detectLocaleFromAcceptLanguage = (header) => {
  if (typeof header !== 'string' || header.length === 0) {
    return undefined;
  }

  const locales = header
    .split(',')
    .map((part) => part.split(';')[0].trim().toLowerCase())
    .filter(Boolean);

  for (const locale of locales) {
    if (locale.startsWith('es')) {
      return 'es';
    }
    if (locale.startsWith('en')) {
      return 'en';
    }
  }

  return undefined;
};

const lookupCountryCode = async (ip) => {
  if (!ip || isPrivateIp(ip)) {
    return undefined;
  }

  try {
    const url = `${GEOLOCATION_API_BASE_URL}/${ip}/json/`;
    const response = await axios.get(url, {
      timeout: 1500,
    });
    const countryCode =
      response.data?.country || response.data?.country_code || response.data?.country_code_iso3;
    if (typeof countryCode === 'string' && countryCode.length >= 2) {
      return countryCode.toUpperCase();
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[locale] Geo lookup failed:', error.message || error);
    }
  }

  return undefined;
};

const detectLocale = async (req) => {
  const cookieLocale = req.cookies?.[LOCALE_COOKIE_NAME];
  if (SUPPORTED_LOCALES.has(cookieLocale)) {
    return cookieLocale;
  }

  const ip = extractIp(req);
  const countryCode = await lookupCountryCode(ip);
  if (countryCode) {
    if (SPANISH_COUNTRY_SET.has(countryCode)) {
      return 'es';
    }
    return 'en';
  }

  const headerLocale = detectLocaleFromAcceptLanguage(req.headers['accept-language']);
  if (headerLocale && SUPPORTED_LOCALES.has(headerLocale)) {
    return headerLocale;
  }

  return DEFAULT_LOCALE;
};

module.exports = {
  detectLocale,
  extractIp,
};
