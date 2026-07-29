import { randomUUID } from 'node:crypto';
import type { OAuthRegisteredClientsStore } from '@modelcontextprotocol/sdk/server/auth/clients.js';
import type { OAuthClientInformationFull } from '@modelcontextprotocol/sdk/shared/auth.js';
import db from '../db.js';

const getStmt = db.prepare('SELECT data_json FROM oauth_clients WHERE client_id = ?');
const insertStmt = db.prepare(
  'INSERT OR REPLACE INTO oauth_clients (client_id, data_json, created_at) VALUES (?, ?, ?)'
);

export class SqliteClientsStore implements OAuthRegisteredClientsStore {
  getClient(clientId: string): OAuthClientInformationFull | undefined {
    const row = getStmt.get(clientId) as { data_json: string } | undefined;
    if (!row) {
      return undefined;
    }
    return JSON.parse(row.data_json) as OAuthClientInformationFull;
  }

  registerClient(
    client: Omit<OAuthClientInformationFull, 'client_id' | 'client_id_issued_at'>
  ): OAuthClientInformationFull {
    const clientId = randomUUID();
    const fullClient: OAuthClientInformationFull = {
      ...client,
      client_id: clientId,
      client_id_issued_at: Math.floor(Date.now() / 1000),
    };
    insertStmt.run(clientId, JSON.stringify(fullClient), Date.now());
    return fullClient;
  }
}

export const clientsStore = new SqliteClientsStore();
