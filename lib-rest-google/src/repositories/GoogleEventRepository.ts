import type { Event } from '@gm/lib-common-google';
import type { Auth } from 'googleapis';

import { google } from 'googleapis';

import type { EventRepository } from './interfaces';

export class GoogleEventRepository implements EventRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async create(calendarId: string, event: Event): Promise<Record<string, any>> {
    const res = await google
      .calendar({ auth: this.auth, version: 'v3' })
      .events.insert({ calendarId, requestBody: event });
    return res.data;
  }
  async list(calendarId = 'primary'): Promise<Record<string, any>[]> {
    const res = await google
      .calendar({ auth: this.auth, version: 'v3' })
      .events.list({ calendarId, singleEvents: true });
    return res.data.items ?? [];
  }
  async update(
    calendarId: string,
    eventId: string,
    changes: Pick<Event, 'description' | 'summary'>,
  ): Promise<Record<string, any>> {
    const res = await google
      .calendar({ auth: this.auth, version: 'v3' })
      .events.patch({ calendarId, eventId, requestBody: changes });
    return res.data;
  }
}
