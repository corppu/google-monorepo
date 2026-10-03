import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleEventRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(calendarId = 'primary'): Promise<Record<string, any>[]> {
    const res = await google
      .calendar({ auth: this.auth, version: 'v3' })
      .events.list({ calendarId, singleEvents: true });
    return res.data.items ?? [];
  }
}
