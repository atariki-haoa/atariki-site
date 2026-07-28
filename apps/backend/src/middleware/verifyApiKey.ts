import type { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';

export function verifyApiKey(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.BACKEND_API_KEY;
  if (!expected) {
    res.status(500).json({ error: 'server_misconfigured' });
    return;
  }

  const authHeader = req.headers.authorization ?? '';
  const match = /^Bearer (.+)$/.exec(authHeader);
  if (!match) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  const provided = match[1];
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);

  if (expectedBuf.length !== providedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  next();
}
