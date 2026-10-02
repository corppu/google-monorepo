import { GoogleCalendarService, GoogleEventService, GoogleGroupService, GoogleUserService } from '@gm/lib-rest-google';
import type { GoogleHandlerContext } from './context';

export async function loadDashboardData(ctx: GoogleHandlerContext, sessionId: string) {
  const auth = ctx.auth.authorizedClient(sessionId);
  const [userinfo, calendars, events, groups] = await Promise.all([
    new GoogleUserService(auth).get(),
    new GoogleCalendarService(auth).list(),
    new GoogleEventService(auth).list(),
    new GoogleGroupService(auth).list().catch(() => [])
  ]);
  return { userinfo, calendars, events, groups };
}
