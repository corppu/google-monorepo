import type { CalendarListEntry } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleCalendarListEntryFilter: Filter<CalendarListEntry> = (item) => !!item.id;
