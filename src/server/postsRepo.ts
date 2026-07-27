import db from './db';
import type { PostData } from '../types/post';

const listStatement = db.prepare('SELECT * FROM posts ORDER BY created_at DESC');
const getBySlugStatement = db.prepare('SELECT * FROM posts WHERE slug = ?');

function list(): PostData[] {
  return listStatement.all() as unknown as PostData[];
}

function getBySlug(slug: string): PostData | null {
  const row = getBySlugStatement.get(slug);
  return (row as unknown as PostData) ?? null;
}

export default { list, getBySlug };
