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

export const createEventHandler =
  (ctx: GoogleHandlerContext) => async (req: Request, res: Response) => {
    const calendarId =
      typeof req.query.calendarId === 'string' ? req.query.calendarId : '';
    const body = req.body as Partial<Event>;
    const summary =
      typeof body?.summary === 'string' ? body.summary.trim() : '';
    const start = body?.start?.dateTime;
    const end = body?.end?.dateTime;
    if (
      !calendarId ||
      !summary ||
      typeof start !== 'string' ||
      typeof end !== 'string' ||
      Number.isNaN(Date.parse(start)) ||
      Number.isNaN(Date.parse(end)) ||
      Date.parse(end) <= Date.parse(start)
    ) {
      res.status(400).json({
        error: 'calendarId, title, and valid start/end date-times are required',
      });
      return;
    }

    const event: Event = {
      description:
        typeof body.description === 'string' ? body.description : undefined,
      end: { dateTime: end },
      start: { dateTime: start },
      summary,
    };
    try {
      res.json(
        await new GoogleEventService(
          ctx.auth.authorizedClient((res.locals as any).sid),
        ).create(calendarId, event),
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
