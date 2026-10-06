import type { EventOrganizer } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleEventOrganizerFilter: Filter<EventOrganizer> = (item) =>
  !!item.email;
