import type { EventDateTime } from './EventDateTime';
import type { EventReminder } from './EventReminder';
import type { EventAttendee } from './EventAttendee';
import type { EventOrganizer } from './EventOrganizer';
import type { EventCreator } from './EventCreator';
import type { Location } from './Location';

export interface Event {
  id?: string; summary?: string; description?: string;
  location?: Location; start?: EventDateTime; end?: EventDateTime;
  reminders?: EventReminder[]; attendees?: EventAttendee[];
  organizer?: EventOrganizer; creator?: EventCreator
}
