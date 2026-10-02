import type { CalendarListEntry } from '../types/CalendarListEntry';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asBoolean, asString } from './guards';

export const GoogleCalendarListEntryMapper: RecordMapper<unknown, CalendarListEntry> = (input) => {
  const rec = asRecord(input);
  return {
    id: asString(rec.id),
    summary: asString(rec.summary),
    primary: asBoolean(rec.primary),
    accessRole: asString(rec.accessRole)
  };
};
