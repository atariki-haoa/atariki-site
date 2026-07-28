import type { PostData } from '../types/post';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY ?? '';

async function backendFetch(path: string): Promise<Response> {
  return fetch(`${BACKEND_URL}${path}`, {
    headers: { Authorization: `Bearer ${BACKEND_API_KEY}` },
  });
}

export async function listPosts(): Promise<PostData[]> {
  const res = await backendFetch('/posts');
  if (!res.ok) {
    throw new Error(`Backend GET /posts failed: ${res.status}`);
  }
  return res.json();
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const res = await backendFetch(`/posts/${encodeURIComponent(slug)}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Backend GET /posts/${slug} failed: ${res.status}`);
  }
  return res.json();
}
