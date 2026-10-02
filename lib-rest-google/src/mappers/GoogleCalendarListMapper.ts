import type { CalendarList } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';
import { GoogleCalendarListEntryMapper } from './GoogleCalendarListEntryMapper';

export const GoogleCalendarListMapper: RecordMapper<Record<string, any>, CalendarList> = (r) => ({
  items: (r.items ?? []).map(GoogleCalendarListEntryMapper)
});
