import type { Request, Response } from 'express';
import { googleServicesFor } from './googleServices';
import type { GoogleHandlerContext } from './context';

export const userinfoHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      res.json(
        await googleServicesFor(ctx, req, (res.locals as any).sid).user.get(),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };
