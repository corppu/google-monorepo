import type { EventReminder } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleEventReminderFilter: Filter<EventReminder> = (item) => item.minutes !== undefined;
