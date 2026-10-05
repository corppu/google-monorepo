import {
  GoogleCalendarService,
  GoogleEventService,
  GoogleGroupService,
  GooglePublicContactInfoService,
  GoogleUserService,
} from '@gm/lib-rest-google';
import type { GoogleHandlerContext } from './context';

export async function loadDashboardData(
  ctx: GoogleHandlerContext,
  sessionId: string,
) {
  const auth = ctx.auth.authorizedClient(sessionId);
  const contactInfoResult = new GooglePublicContactInfoService(auth)
    .get()
    .then((publicContactInfo) => ({ publicContactInfo }))
    .catch((error: unknown) => ({
      publicContactInfoError:
        error instanceof Error
          ? error.message
          : 'Unable to load public contact information.',
    }));
  const [userinfo, contactInfo, calendars, events, groups] = await Promise.all([
    new GoogleUserService(auth).get(),
    contactInfoResult,
    new GoogleCalendarService(auth).list(),
    new GoogleEventService(auth).list(),
    new GoogleGroupService(auth).list().catch(() => []),
  ]);
  return { calendars, events, groups, ...contactInfo, userinfo };
}
