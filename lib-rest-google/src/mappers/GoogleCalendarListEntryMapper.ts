import type { CalendarListEntry } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleCalendarListEntryMapper: RecordMapper<Record<string, any> | null | undefined, CalendarListEntry> = (r) => ({
  id: r?.id ?? undefined,
  summary: r?.summary ?? undefined,
  primary: r?.primary ?? undefined,
  accessRole: r?.accessRole ?? undefined
});
