import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleCalendarRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(groupEmail?: string): Promise<Record<string, any>> {
    const calendar = google.calendar({ auth: this.auth, version: 'v3' });
    const calendarList = (await calendar.calendarList.list()).data;
    if (!groupEmail) return calendarList;

    const items = await Promise.all(
      (calendarList.items ?? []).map(async (item) => {
        if (!item.id) return null;
        const acl = await calendar.acl.list({ calendarId: item.id });
        const isLinkedToGroup = acl.data.items?.some(
          (rule) =>
            rule.scope?.type === 'group' &&
            rule.scope.value?.toLowerCase() === groupEmail.toLowerCase(),
        );
        return isLinkedToGroup ? item : null;
      }),
    );

    return {
      ...calendarList,
      items: items.filter((item): item is Record<string, any> => item !== null),
    };
  }
  async get(calendarId: string): Promise<Record<string, any>> {
    return (
      await google
        .calendar({ auth: this.auth, version: 'v3' })
        .calendars.get({ calendarId })
    ).data;
  }
}
