import type { EventDateTime } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleEventDateTimeFilter: Filter<EventDateTime> = (item) => !!(item.date || item.dateTime);
