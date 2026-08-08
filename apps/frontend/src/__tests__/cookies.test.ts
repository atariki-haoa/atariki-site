import { parseCookies, getCookieValue } from '../utils/cookies';

describe('parseCookies', () => {
  it('parses a single cookie', () => {
    expect(parseCookies('name=value')).toEqual({ name: 'value' });
  });

  it('parses multiple cookies', () => {
    expect(parseCookies('a=1; b=2; c=3')).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('handles cookies with = in value', () => {
    expect(parseCookies('token=abc=def')).toEqual({ token: 'abc=def' });
  });

  it('handles encoded values', () => {
    expect(parseCookies('name=hello%20world')).toEqual({ name: 'hello world' });
  });

  it('returns empty object for undefined', () => {
    expect(parseCookies(undefined)).toEqual({});
  });

  it('returns empty object for empty string', () => {
    expect(parseCookies('')).toEqual({});
  });

  it('trims whitespace around keys and values', () => {
    expect(parseCookies('  a = 1 ;  b = 2 ')).toEqual({ a: '1', b: '2' });
  });
});

describe('getCookieValue', () => {
  it('returns the value for an existing cookie', () => {
    expect(getCookieValue('lang=es; theme=dark', 'lang')).toBe('es');
  });

  it('returns undefined for a missing cookie', () => {
    expect(getCookieValue('lang=es', 'theme')).toBeUndefined();
  });

  it('returns undefined for undefined header', () => {
    expect(getCookieValue(undefined, 'lang')).toBeUndefined();
  });
});
