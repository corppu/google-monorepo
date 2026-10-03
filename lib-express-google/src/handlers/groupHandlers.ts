import type { Request, Response } from 'express';
import { GoogleGroupService } from '@gm/lib-rest-google';
import type { GoogleHandlerContext } from './context';

export const listGroupsHandler =
  (ctx: GoogleHandlerContext) => async (_req: Request, res: Response) => {
    try {
      res.json(
        await new GoogleGroupService(
          ctx.auth.authorizedClient((res.locals as any).sid),
        ).list(),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };
