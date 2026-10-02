import type { Request, Response } from 'express';
import { GoogleEventService } from '@gm/lib-rest-google';
import type { GoogleHandlerContext } from './context';

export const listEventsHandler = (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
  try {
    const calendarId = typeof req.query.calendarId === 'string' ? req.query.calendarId : undefined;
    res.json(await new GoogleEventService(ctx.auth.authorizedClient((res.locals as any).sid)).list(calendarId));
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
};
