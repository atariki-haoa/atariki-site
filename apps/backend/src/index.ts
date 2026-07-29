import 'dotenv/config';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { mcpAuthRouter, getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import postsRouter from './routes/posts.js';
import { verifyApiKey } from './middleware/verifyApiKey.js';
import { createMcpServer } from './mcp/server.js';
import { oauthProvider } from './oauth/provider.js';
import oauthLoginRouter from './routes/oauthLogin.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/posts', verifyApiKey, postsRouter);

const port = Number(process.env.BACKEND_PORT ?? 4000);
const backendPublicUrl = new URL(process.env.BACKEND_PUBLIC_URL || `http://localhost:${port}`);
const mcpResourceUrl = new URL('/mcp', backendPublicUrl);

app.use(
  mcpAuthRouter({
    provider: oauthProvider,
    issuerUrl: backendPublicUrl,
    resourceServerUrl: mcpResourceUrl,
    scopesSupported: ['mcp:tools'],
  })
);
app.use(oauthLoginRouter);

const requireMcpAuth = requireBearerAuth({
  verifier: oauthProvider,
  requiredScopes: ['mcp:tools'],
  resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(mcpResourceUrl),
});

app.post('/mcp', requireMcpAuth, async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

  res.on('close', () => {
    void transport.close();
    void server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get('/mcp', (_req, res) => {
  res.status(405).json({ error: 'method_not_allowed' });
});

app.delete('/mcp', (_req, res) => {
  res.status(405).json({ error: 'method_not_allowed' });
});

app.listen(port, () => {
  console.log(`> Backend ready on http://localhost:${port}`);
});
