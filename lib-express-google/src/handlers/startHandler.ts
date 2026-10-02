import type { Request, Response } from 'express';
import type { GoogleHandlerContext } from './context';

export const startHandler = (ctx: GoogleHandlerContext) => (req: Request, res: Response) => {
  req.session.returnTo = req.query.target === 'ssr' ? 'ssr' : 'spa';
  res.redirect(ctx.auth.startUrl((res.locals as any).sid));
};
