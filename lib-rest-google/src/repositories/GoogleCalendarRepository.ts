import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleCalendarRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(): Promise<Record<string, any>> {
    return (
      await google
        .calendar({ auth: this.auth, version: 'v3' })
        .calendarList.list()
    ).data;
  }
  async get(calendarId: string): Promise<Record<string, any>> {
    return (
      await google
        .calendar({ auth: this.auth, version: 'v3' })
        .calendars.get({ calendarId })
    ).data;
  }
}
