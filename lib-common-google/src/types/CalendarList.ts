import type { calendar_v3 } from 'googleapis';
import type { CalendarListEntry } from './CalendarListEntry';
export type CalendarList = Omit<calendar_v3.Schema$CalendarList, 'items'> & { items: CalendarListEntry[] };
