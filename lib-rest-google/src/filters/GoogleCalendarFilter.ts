import type { Calendar } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleCalendarFilter: Filter<Calendar> = (item) => !!item.id;
