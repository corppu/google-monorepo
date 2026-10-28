import type { Request, Response } from 'express';

import type { GoogleHandlerContext } from './context';

import { googleServicesFor } from './googleServices';

export const listCalendarsHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      const groupEmail =
        typeof req.query.groupEmail === 'string'
          ? req.query.groupEmail
          : undefined;
      res.json(
        await (
          await googleServicesFor(ctx, req, (res.locals as any).sid)
        ).calendars.list(groupEmail),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };
