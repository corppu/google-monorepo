import type { EventCreator } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleEventCreatorFilter: Filter<EventCreator> = (item) => !!item.email;
