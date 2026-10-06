import type { Request, Response } from 'express';
import { googleServicesFor } from './googleServices';
import type { GoogleHandlerContext } from './context';

export const listGroupsHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      res.json(
        await googleServicesFor(
          ctx,
          req,
          (res.locals as any).sid,
        ).groups.list(),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };
