import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleEventRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(calendarId = 'primary'): Promise<Record<string, any>[]> {
    const res = await google.calendar({ version: 'v3', auth: this.auth }).events.list({ calendarId, singleEvents: true });
    return res.data.items ?? [];
  }
}
