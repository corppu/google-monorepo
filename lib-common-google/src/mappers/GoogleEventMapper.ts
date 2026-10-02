import type { Event } from '../types/Event';
import type { RecordMapper } from './RecordMapper';
import { GoogleEventDateTimeMapper } from './GoogleEventDateTimeMapper';
import { GoogleEventReminderMapper } from './GoogleEventReminderMapper';
import { GoogleEventAttendeeMapper } from './GoogleEventAttendeeMapper';
import { GoogleEventOrganizerMapper } from './GoogleEventOrganizerMapper';
import { GoogleEventCreatorMapper } from './GoogleEventCreatorMapper';
import { asArray, asBoolean, asRecord, asString } from './guards';

export const GoogleEventMapper: RecordMapper<unknown, Event> = (input) => {
  const rec = asRecord(input);
  const reminders = asRecord(rec.reminders);
  return {
    id: asString(rec.id),
    summary: asString(rec.summary),
    description: asString(rec.description),
    location: asString(rec.location),
    start: GoogleEventDateTimeMapper(rec.start),
    end: GoogleEventDateTimeMapper(rec.end),
    reminders: {
      useDefault: asBoolean(reminders.useDefault),
      overrides: asArray(reminders.overrides).map(GoogleEventReminderMapper)
    },
    attendees: asArray(rec.attendees).map(GoogleEventAttendeeMapper),
    organizer: GoogleEventOrganizerMapper(rec.organizer),
    creator: GoogleEventCreatorMapper(rec.creator)
  };
};
