import { NextApiRequest, NextApiResponse } from 'next';
import postsRepo from '../../../../server/postsRepo';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;
  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  const post = postsRepo.getBySlug(slug);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${post.slug}.md"`);
  res.status(200).send(post.content_md);
}
