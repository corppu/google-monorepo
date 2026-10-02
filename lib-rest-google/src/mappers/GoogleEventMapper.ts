import type { Event } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';
import { GoogleLocationMapper } from './GoogleLocationMapper';
import { GoogleEventDateTimeMapper } from './GoogleEventDateTimeMapper';
import { GoogleEventReminderMapper } from './GoogleEventReminderMapper';
import { GoogleEventAttendeeMapper } from './GoogleEventAttendeeMapper';
import { GoogleEventOrganizerMapper } from './GoogleEventOrganizerMapper';
import { GoogleEventCreatorMapper } from './GoogleEventCreatorMapper';

export const GoogleEventMapper: RecordMapper<Record<string, any>, Event> = (r) => ({
  id: r.id ?? undefined,
  summary: r.summary ?? undefined,
  description: r.description ?? undefined,
  location: r.location ? GoogleLocationMapper({ name: r.location }) : undefined,
  start: GoogleEventDateTimeMapper(r.start),
  end: GoogleEventDateTimeMapper(r.end),
  reminders: (r.reminders?.overrides ?? []).map(GoogleEventReminderMapper),
  attendees: (r.attendees ?? []).map(GoogleEventAttendeeMapper),
  organizer: GoogleEventOrganizerMapper(r.organizer),
  creator: GoogleEventCreatorMapper(r.creator)
});
