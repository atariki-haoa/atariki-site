import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 90;

function getJwtSecret(): string {
  const secret = process.env.OAUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('OAUTH_JWT_SECRET is not set');
  }
  return secret;
}

export function generateOpaqueToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function signAccessToken(params: { clientId: string; scopes: string[]; resource?: URL }): {
  token: string;
  expiresIn: number;
} {
  const token = jwt.sign(
    {
      client_id: params.clientId,
      scope: params.scopes.join(' '),
      resource: params.resource?.toString(),
    },
    getJwtSecret(),
    { subject: 'admin', expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
  return { token, expiresIn: ACCESS_TOKEN_TTL_SECONDS };
}

export function verifyAccessTokenJwt(token: string): AuthInfo {
  const payload = jwt.verify(token, getJwtSecret()) as jwt.JwtPayload;
  return {
    token,
    clientId: String(payload.client_id),
    scopes: typeof payload.scope === 'string' ? payload.scope.split(' ').filter(Boolean) : [],
    expiresAt: payload.exp,
    resource: typeof payload.resource === 'string' ? new URL(payload.resource) : undefined,
  };
}
