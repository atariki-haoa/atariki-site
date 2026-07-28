import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import postsRepo from '../postsRepo.js';
import { generateSlug } from '../generateSlug.js';
import { extractTitle } from '../extractTitle.js';

const POST_TYPES = ['conversation', 'guide', 'note'] as const;
const LOCALES = ['es', 'en'] as const;

export function createMcpServer(): McpServer {
  const server = new McpServer({ name: 'atariki-blog', version: '1.0.0' });

  server.registerTool(
    'publish_post',
    {
      title: 'Publish blog post',
      description: 'Publishes a finalized Markdown blog post to the blog.',
      inputSchema: {
        content_md: z.string().min(1),
        locale: z.enum(LOCALES),
        type: z.enum(POST_TYPES),
        date: z.string().optional(),
      },
      outputSchema: {
        slug: z.string(),
        publishedAt: z.string(),
        mdDownloadUrl: z.string(),
      },
    },
    async ({ content_md, locale, type, date }) => {
      const title = extractTitle(content_md);
      const publishedAt = date ? new Date(date) : new Date();
      const baseSlug = generateSlug(title, publishedAt);

      let slug = baseSlug;
      let suffix = 2;
      while (postsRepo.getBySlug(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }

      postsRepo.create({
        slug,
        locale,
        type,
        title,
        content_md,
        created_at: publishedAt.toISOString(),
      });

      const output = {
        slug,
        publishedAt: publishedAt.toISOString(),
        mdDownloadUrl: `${process.env.FRONTEND_PUBLIC_URL ?? 'http://localhost:3000'}/api/blog/${slug}/download`,
      };

      return {
        content: [{ type: 'text' as const, text: JSON.stringify(output) }],
        structuredContent: output,
      };
    }
  );

  return server;
}
