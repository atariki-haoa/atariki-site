import { randomUUID, timingSafeEqual } from 'node:crypto';
import type { Response } from 'express';
import type { OAuthServerProvider, AuthorizationParams } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import type {
  OAuthClientInformationFull,
  OAuthTokenRevocationRequest,
  OAuthTokens,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { InvalidRequestError, InvalidGrantError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import { clientsStore } from './clientsStore.js';
import { renderLoginPage } from './loginPage.js';
import { generateOpaqueToken, hashToken, signAccessToken, verifyAccessTokenJwt } from './tokens.js';
import { createRefreshToken, findValidRefreshToken, revokeRefreshToken } from './refreshTokenRepo.js';

const PENDING_TTL_MS = 10 * 60 * 1000;
const CODE_TTL_MS = 60 * 1000;

interface PendingAuthorization {
  client: OAuthClientInformationFull;
  params: AuthorizationParams;
  expiresAt: number;
}

interface IssuedCode {
  client: OAuthClientInformationFull;
  params: AuthorizationParams;
  expiresAt: number;
}

function isCorrectAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(password);
  return expectedBuf.length === providedBuf.length && timingSafeEqual(expectedBuf, providedBuf);
}

export class AtarikiOAuthProvider implements OAuthServerProvider {
  readonly clientsStore = clientsStore;

  private readonly pending = new Map<string, PendingAuthorization>();
  private readonly codes = new Map<string, IssuedCode>();

  async authorize(client: OAuthClientInformationFull, params: AuthorizationParams, res: Response): Promise<void> {
    if (!client.redirect_uris.includes(params.redirectUri)) {
      throw new InvalidRequestError('Unregistered redirect_uri');
    }

    const txn = randomUUID();
    this.pending.set(txn, { client, params, expiresAt: Date.now() + PENDING_TTL_MS });
    res.set('Content-Type', 'text/html');
    res.send(renderLoginPage({ txn, clientName: client.client_name }));
  }

  async completeLogin(txn: string, password: string, res: Response): Promise<void> {
    const pending = this.pending.get(txn);
    if (!pending || pending.expiresAt < Date.now()) {
      this.pending.delete(txn);
      res.status(400).send('La sesión de autorización expiró. Volvé a intentar desde el cliente MCP.');
      return;
    }

    if (!isCorrectAdminPassword(password)) {
      res.set('Content-Type', 'text/html');
      res.send(renderLoginPage({ txn, clientName: pending.client.client_name, error: 'Contraseña incorrecta.' }));
      return;
    }

    this.pending.delete(txn);

    const code = randomUUID();
    this.codes.set(code, { client: pending.client, params: pending.params, expiresAt: Date.now() + CODE_TTL_MS });

    const redirectUrl = new URL(pending.params.redirectUri);
    redirectUrl.searchParams.set('code', code);
    if (pending.params.state !== undefined) {
      redirectUrl.searchParams.set('state', pending.params.state);
    }
    res.redirect(redirectUrl.toString());
  }

  async challengeForAuthorizationCode(client: OAuthClientInformationFull, authorizationCode: string): Promise<string> {
    const issued = this.codes.get(authorizationCode);
    if (!issued || issued.client.client_id !== client.client_id) {
      throw new InvalidGrantError('Invalid authorization code');
    }
    return issued.params.codeChallenge;
  }

  async exchangeAuthorizationCode(client: OAuthClientInformationFull, authorizationCode: string): Promise<OAuthTokens> {
    const issued = this.codes.get(authorizationCode);
    if (!issued || issued.client.client_id !== client.client_id || issued.expiresAt < Date.now()) {
      this.codes.delete(authorizationCode);
      throw new InvalidGrantError('Invalid or expired authorization code');
    }
    this.codes.delete(authorizationCode);

    return this.issueTokens(client.client_id, issued.params.scopes ?? [], issued.params.resource);
  }

  async exchangeRefreshToken(client: OAuthClientInformationFull, refreshToken: string): Promise<OAuthTokens> {
    const tokenHash = hashToken(refreshToken);
    const record = findValidRefreshToken(tokenHash);
    if (!record || record.clientId !== client.client_id) {
      throw new InvalidGrantError('Invalid or expired refresh token');
    }
    revokeRefreshToken(tokenHash);

    return this.issueTokens(client.client_id, record.scopes, record.resource);
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    return verifyAccessTokenJwt(token);
  }

  async revokeToken(_client: OAuthClientInformationFull, request: OAuthTokenRevocationRequest): Promise<void> {
    revokeRefreshToken(hashToken(request.token));
  }

  private issueTokens(clientId: string, scopes: string[], resource?: URL): OAuthTokens {
    const { token: accessToken, expiresIn } = signAccessToken({ clientId, scopes, resource });

    const refreshToken = generateOpaqueToken();
    createRefreshToken(hashToken(refreshToken), { clientId, scopes, resource });

    return {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: expiresIn,
      scope: scopes.join(' '),
      refresh_token: refreshToken,
    };
  }
}

export const oauthProvider = new AtarikiOAuthProvider();
