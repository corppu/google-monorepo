import type { CalendarList } from '@gm/lib-common-google';
import type { Filter } from './Filter';
import { GoogleCalendarListEntryFilter } from './GoogleCalendarListEntryFilter';

export const GoogleCalendarListFilter: Filter<CalendarList> = (item) =>
  item.items.some(GoogleCalendarListEntryFilter);
