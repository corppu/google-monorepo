import type { Request, Response } from 'express';
import { GoogleUserService } from '@gm/lib-rest-google';
import type { GoogleHandlerContext } from './context';

export const userinfoHandler = (ctx: GoogleHandlerContext) => async (_req: Request, res: Response) => {
  try {
    res.json(await new GoogleUserService(ctx.auth.authorizedClient((res.locals as any).sid)).get());
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
};
