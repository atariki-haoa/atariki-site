import { timingSafeEqual } from 'crypto';

export function verifyMcpBearerToken(authHeader: string | undefined): boolean {
  const expected = process.env.MCP_BEARER_TOKEN;
  if (!expected) {
    return false;
  }

  const match = /^Bearer (.+)$/.exec(authHeader ?? '');
  if (!match) {
    return false;
  }

  const provided = match[1];
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);

  return expectedBuf.length === providedBuf.length && timingSafeEqual(expectedBuf, providedBuf);
}
