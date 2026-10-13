import type { Request } from 'express';
import {
  CREATE_EVENT_OPTION_ID,
  MOCK_DASHBOARD_DATA,
} from '@gm/lib-common-google';
import { loadDashboardData, sessionIdOf } from '@gm/lib-express-google';
import type { GoogleHandlerContext } from '@gm/lib-express-google';
import type { DashboardData } from '../types';

const str = (value: unknown) => (typeof value === 'string' ? value : undefined);

/**
 * Loads the dashboard for the selection in the query string. Resolves to
 * `undefined` when the request is not authenticated.
 */
export async function loadSSRDashboard(
  req: Request,
): Promise<DashboardData | undefined> {
  const ctx = req.app.locals.googleContext as GoogleHandlerContext | undefined;
  const mock = req.query.mock === 'true';
  const groupEmail = str(req.query.groupEmail);
  const requestedCalendarId = str(req.query.calendarId);
  const requestedEventId =
    req.query.createEvent === 'true'
      ? CREATE_EVENT_OPTION_ID
      : str(req.query.eventId);

  let calendarId = requestedCalendarId;
  let data: Awaited<ReturnType<typeof loadDashboardData>>;
  if (mock) {
    // Mock mode still goes through the services, backed by Mock*Repository.
    const selection = { calendarId: requestedCalendarId, groupEmail };
    data = await loadDashboardData(ctx, undefined, req, selection);
    calendarId ??= data.calendars.items[0]?.id ?? undefined;
    if (calendarId && !requestedCalendarId) {
      data = await loadDashboardData(ctx, undefined, req, {
        ...selection,
        calendarId,
      });
    }
  } else {
    const sid = ctx && sessionIdOf(ctx, req);
    if (!ctx || !sid) return undefined;
    try {
      data = await loadDashboardData(ctx, sid, req, {
        calendarId,
        groupEmail,
      });
    } catch {
      return undefined;
    }
    calendarId ??= data.calendars.items[0]?.id ?? undefined;
  }
  return {
    ...data,
    selectedCalendarId: calendarId ?? '',
    selectedEventId: requestedEventId ?? data.events[0]?.id ?? '',
    selectedGroupEmail:
      groupEmail ?? (mock ? MOCK_DASHBOARD_DATA.selectedGroupEmail : ''),
  };
}
