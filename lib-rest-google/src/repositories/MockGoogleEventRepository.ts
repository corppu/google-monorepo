import { MOCK_EVENTS } from '@gm/lib-common-google';
import type { Event } from '@gm/lib-common-google';
import type { EventRepository } from './interfaces';

export class MockGoogleEventRepository implements EventRepository {
  private events: Record<string, Event[]> = structuredClone(MOCK_EVENTS);

  async list(calendarId = 'primary'): Promise<Record<string, any>[]> {
    return structuredClone(this.events[calendarId] ?? []);
  }
  async create(calendarId: string, event: Event): Promise<Record<string, any>> {
    const created: Event = {
      ...event,
      id: event.id ?? `mock-event-${Date.now()}`,
    };
    (this.events[calendarId] ??= []).push(created);
    return structuredClone(created);
  }
  async update(
    calendarId: string,
    eventId: string,
    changes: Pick<Event, 'description' | 'summary'>,
  ): Promise<Record<string, any>> {
    const event = this.events[calendarId]?.find((e) => e.id === eventId);
    if (!event) throw new Error(`Mock event not found: ${eventId}`);
    Object.assign(event, changes);
    return structuredClone(event);
  }
}
