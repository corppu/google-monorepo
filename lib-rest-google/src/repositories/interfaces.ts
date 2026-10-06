import type { Event, GooglePublicContactInfo } from '@gm/lib-common-google';

export interface CalendarRepository {
  get(calendarId: string): Promise<Record<string, any>>;
  list(groupEmail?: string): Promise<Record<string, any>>;
}

export interface EventRepository {
  create(calendarId: string, event: Event): Promise<Record<string, any>>;
  list(calendarId?: string): Promise<Record<string, any>[]>;
  update(
    calendarId: string,
    eventId: string,
    changes: Pick<Event, 'description' | 'summary'>,
  ): Promise<Record<string, any>>;
}

export interface GroupRepository {
  list(customer?: string): Promise<Record<string, any>[]>;
  members(groupKey: string): Promise<Record<string, any>[]>;
}

export interface UserRepository {
  get(): Promise<Record<string, any>>;
}

export interface PublicContactInfoRepository {
  get(): Promise<GooglePublicContactInfo>;
}
