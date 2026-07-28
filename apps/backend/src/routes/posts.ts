import { Router } from 'express';
import postsRepo from '../postsRepo.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(postsRepo.list());
});

router.get('/:slug', (req, res) => {
  const post = postsRepo.getBySlug(req.params.slug);
  if (!post) {
    res.status(404).json({ error: 'not_found' });
    return;
  }
  res.json(post);
});

export default router;
