export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rawValue] = part.split('=');
    if (!rawKey) {
      return acc;
    }
    const key = rawKey.trim();
    const value = rawValue.join('=').trim();
    if (key) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {});
};

export const getCookieValue = (cookieHeader: string | undefined, name: string): string | undefined => {
  const cookies = parseCookies(cookieHeader);
  return cookies[name];
};
