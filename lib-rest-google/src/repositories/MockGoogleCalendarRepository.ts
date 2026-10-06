import {
  MOCK_ALL_CALENDARS,
  MOCK_GROUP_CALENDARS,
} from '@gm/lib-common-google';
import type { CalendarRepository } from './interfaces';

export class MockGoogleCalendarRepository implements CalendarRepository {
  async list(groupEmail?: string): Promise<Record<string, any>> {
    const calendars = groupEmail
      ? (MOCK_GROUP_CALENDARS[groupEmail.toLowerCase()] ?? { items: [] })
      : MOCK_ALL_CALENDARS;
    return structuredClone(calendars);
  }
  async get(calendarId: string): Promise<Record<string, any>> {
    const calendar = MOCK_ALL_CALENDARS.items.find((c) => c.id === calendarId);
    if (!calendar) throw new Error(`Mock calendar not found: ${calendarId}`);
    return structuredClone(calendar);
  }
}
