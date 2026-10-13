import type { Request, Response } from 'express';
import type { GoogleHandlerContext } from './context';

export const startHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    req.session.returnTo = req.query.target === 'ssr' ? 'ssr' : 'spa';
    res.redirect(await ctx.auth.startUrl((res.locals as any).sid));
  };
