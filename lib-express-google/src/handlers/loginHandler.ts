import type { Request, Response } from 'express';
import type { GoogleHandlerContext } from './context';

export const loginHandler = (ctx: GoogleHandlerContext) => (req: Request, res: Response) => {
  const { gmail, password } = req.body ?? {};
  if (typeof gmail !== 'string' || typeof password !== 'string' || !gmail || !password) {
    return void res.status(400).json({ error: 'gmail and password required' });
  }
  try {
    const session = ctx.auth.login(gmail, password);
    req.session.gsid = session.sessionId;
    res.json({ ok: true });
  } catch {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};
