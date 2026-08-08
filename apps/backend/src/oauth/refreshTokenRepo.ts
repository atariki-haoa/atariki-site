import db from '../db.js';
import { REFRESH_TOKEN_TTL_SECONDS } from './tokens.js';

interface RefreshTokenRow {
  token_hash: string;
  client_id: string;
  scope: string;
  resource: string | null;
  created_at: number;
  expires_at: number;
  revoked_at: number | null;
}

const insertStmt = db.prepare(`
  INSERT INTO refresh_tokens (token_hash, client_id, scope, resource, created_at, expires_at, revoked_at)
  VALUES (?, ?, ?, ?, ?, ?, NULL)
`);
const getStmt = db.prepare('SELECT * FROM refresh_tokens WHERE token_hash = ?');
const revokeStmt = db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE token_hash = ?');

export interface RefreshTokenRecord {
  clientId: string;
  scopes: string[];
  resource?: URL;
}

export function createRefreshToken(tokenHash: string, record: RefreshTokenRecord): void {
  const now = Date.now();
  insertStmt.run(
    tokenHash,
    record.clientId,
    record.scopes.join(' '),
    record.resource?.toString() ?? null,
    now,
    now + REFRESH_TOKEN_TTL_SECONDS * 1000
  );
}

export function findValidRefreshToken(tokenHash: string): RefreshTokenRecord | null {
  const row = getStmt.get(tokenHash) as RefreshTokenRow | undefined;
  if (!row || row.revoked_at !== null || row.expires_at < Date.now()) {
    return null;
  }
  return {
    clientId: row.client_id,
    scopes: row.scope.split(' ').filter(Boolean),
    resource: row.resource ? new URL(row.resource) : undefined,
  };
}

export function revokeRefreshToken(tokenHash: string): void {
  revokeStmt.run(Date.now(), tokenHash);
}
