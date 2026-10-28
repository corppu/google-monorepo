import type { Request, Response } from 'express';

import type { GoogleHandlerContext } from './context';

import { googleServicesFor } from './googleServices';

export const userinfoHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      res.json(
        await (
          await googleServicesFor(ctx, req, (res.locals as any).sid)
        ).user.get(),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };
