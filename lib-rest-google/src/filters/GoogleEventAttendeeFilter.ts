import type { EventAttendee } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleEventAttendeeFilter: Filter<EventAttendee> = (item) => !!item.email;
