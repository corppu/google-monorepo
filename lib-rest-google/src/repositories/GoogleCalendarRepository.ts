import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleCalendarRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(): Promise<Record<string, any>> {
    return (await google.calendar({ version: 'v3', auth: this.auth }).calendarList.list()).data;
  }
  async get(calendarId: string): Promise<Record<string, any>> {
    return (await google.calendar({ version: 'v3', auth: this.auth }).calendars.get({ calendarId })).data;
  }
}
