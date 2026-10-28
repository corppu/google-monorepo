'use server';

import type { GoogleEventChanges } from '@gm/lib-common-google';

import { createMockGoogleServices } from '@gm/lib-rest-google';

// Server function: the save goes to GoogleEventService -> MockGoogleEventRepository.
export async function saveEvent(
  calendarId: string,
  eventId: string | null,
  changes: GoogleEventChanges,
) {
  const { events } = createMockGoogleServices();
  return eventId
    ? events.update(calendarId, eventId, changes)
    : events.create(calendarId, changes);
}
