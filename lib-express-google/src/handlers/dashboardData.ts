import type { GoogleHandlerContext } from './context';
import { googleServicesFor } from './googleServices';

export async function loadDashboardData(
  ctx: GoogleHandlerContext | undefined,
  sessionId: string | undefined,
  req: { query: Record<string, unknown> } = { query: {} },
  selection: { calendarId?: string; groupEmail?: string } = {},
) {
  const services = googleServicesFor(ctx, req as any, sessionId);
  const contactInfoResult = services.contactInfo
    .get()
    .then((publicContactInfo) => ({ publicContactInfo }))
    .catch((error: unknown) => ({
      publicContactInfoError:
        error instanceof Error
          ? error.message
          : 'Unable to load public contact information.',
    }));
  const [userinfo, contactInfo, calendars, events, groups] = await Promise.all([
    services.user.get(),
    contactInfoResult,
    services.calendars.list(selection.groupEmail),
    services.events.list(selection.calendarId),
    services.groups.list().catch(() => []),
  ]);
  return { calendars, events, groups, ...contactInfo, userinfo };
}
