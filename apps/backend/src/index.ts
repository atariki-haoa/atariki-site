import 'dotenv/config';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import postsRouter from './routes/posts.js';
import contactRouter from './routes/contact.js';
import quoteRouter from './routes/quote.js';
import { verifyApiKey } from './middleware/verifyApiKey.js';
import { verifyMcpBearerToken } from './mcp/auth.js';
import { createMcpServer } from './mcp/server.js';

const app = express();
app.use(express.json());

app.use('/posts', verifyApiKey, postsRouter);
app.use('/contact', verifyApiKey, contactRouter);
app.use('/quote', verifyApiKey, quoteRouter);

app.post('/mcp', async (req, res) => {
  if (!verifyMcpBearerToken(req.headers.authorization)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

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

const port = Number(process.env.BACKEND_PORT ?? 4000);
app.listen(port, () => {
  console.log(`> Backend ready on http://localhost:${port}`);
});
