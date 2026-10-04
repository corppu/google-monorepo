import type { Request, Response } from 'express';
import { GoogleEventService } from '@gm/lib-rest-google';
import type { Event } from '@gm/lib-common-google';
import type { GoogleHandlerContext } from './context';

export const listEventsHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    try {
      const calendarId =
        typeof req.query.calendarId === 'string'
          ? req.query.calendarId
          : undefined;
      res.json(
        await new GoogleEventService(
          ctx.auth.authorizedClient((res.locals as any).sid),
        ).list(calendarId),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };

export const updateEventHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    const calendarId =
      typeof req.query.calendarId === 'string' ? req.query.calendarId : '';
    const eventId = Array.isArray(req.params.eventId)
      ? req.params.eventId[0]
      : req.params.eventId;
    const body = req.body as Partial<Pick<Event, 'description' | 'summary'>>;
    const changes: Partial<Pick<Event, 'description' | 'summary'>> = {};
    if (typeof body?.summary === 'string') changes.summary = body.summary;
    if (typeof body?.description === 'string') {
      changes.description = body.description;
    }
    if (!calendarId || !eventId || Object.keys(changes).length === 0) {
      res
        .status(400)
        .json({ error: 'calendarId and event changes are required' });
      return;
    }

    try {
      res.json(
        await new GoogleEventService(
          ctx.auth.authorizedClient((res.locals as any).sid),
        ).update(calendarId, eventId, changes),
      );
    } catch (e) {
      res.status(502).json({ error: (e as Error).message });
    }
  };
