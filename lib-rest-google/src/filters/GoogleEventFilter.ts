import type { Event } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleEventFilter: Filter<Event> = (item) => !!item.id;
