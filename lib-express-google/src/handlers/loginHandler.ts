import type { Request, Response } from 'express';
import { signJwt } from './context';
import type { GoogleHandlerContext } from './context';

export const loginHandler = (ctx: GoogleHandlerContext) => (req: Request, res: Response) => {
  const { gmail, password, client } = req.body ?? {};
  if (typeof gmail !== 'string' || typeof password !== 'string' || !gmail || !password) {
    return void res.status(400).json({ error: 'gmail and password required' });
  }
  try {
    const session = ctx.auth.login(gmail, password);
    if (client === 'native') {
      return void res.json({ sessionId: session.sessionId, token: signJwt(session.sessionId, ctx.jwtSecret) });
    }
    req.session.gsid = session.sessionId;
    res.json({ ok: true });
  } catch {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};
