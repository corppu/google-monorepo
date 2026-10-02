import type { CalendarList } from '../types/CalendarList';
import type { RecordMapper } from './RecordMapper';
import { GoogleCalendarListEntryMapper } from './GoogleCalendarListEntryMapper';
import { asArray, asRecord } from './guards';

export const GoogleCalendarListMapper: RecordMapper<unknown, CalendarList> = (input) => ({
  items: asArray(asRecord(input).items).map(GoogleCalendarListEntryMapper)
});
