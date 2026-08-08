import db from './db.js';
import type { PostData } from './types/post.js';

const listStatement = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
const getBySlugStatement = db.prepare('SELECT * FROM posts WHERE slug = ?');
const insertStatement = db.prepare(`
  INSERT INTO posts (slug, locale, type, title, content_md, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

function list(): PostData[] {
  return listStatement.all() as unknown as PostData[];
}

function getBySlug(slug: string): PostData | null {
  const row = getBySlugStatement.get(slug);
  return (row as unknown as PostData) ?? null;
}

interface CreatePostInput {
  slug: string;
  locale: PostData['locale'];
  type: PostData['type'];
  title: string;
  content_md: string;
  created_at: string;
}

function create(input: CreatePostInput): PostData {
  insertStatement.run(input.slug, input.locale, input.type, input.title, input.content_md, input.created_at);
  const created = getBySlug(input.slug);
  if (!created) {
    throw new Error(`Failed to read back post after insert: ${input.slug}`);
  }
  return created;
}

export default { list, getBySlug, create };
