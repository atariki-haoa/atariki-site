import { Router } from 'express';
import { oauthProvider } from '../oauth/provider.js';

const router = Router();

router.post('/authorize/login', async (req, res) => {
  const { txn, password } = req.body as { txn?: string; password?: string };
  if (!txn || !password) {
    res.status(400).send('Missing txn or password');
    return;
  }
  await oauthProvider.completeLogin(txn, password, res);
});

export default router;
