import type { Request, Response } from 'express';
import { sessionIdOf } from './context';
import type { GoogleHandlerContext } from './context';

export const callbackHandler = (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
  const sid = sessionIdOf(ctx, req);
  const { code, state } = req.query;
  if (!sid || typeof code !== 'string' || typeof state !== 'string') {
    return void res.status(400).json({ error: 'Invalid callback' });
  }
  try {
    await ctx.auth.handleCallback(sid, code, state);
  } catch {
    return void res.status(400).json({ error: 'Authorization failed' });
  }
  const target = req.session.returnTo === 'ssr' ? 'ssr' : 'spa';
  res.redirect(`/${target}/dashboard`);
};
