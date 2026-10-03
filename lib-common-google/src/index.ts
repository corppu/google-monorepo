export type { EventDateTime } from './types/EventDateTime';
export type { EventReminder } from './types/EventReminder';
export type { EventAttendee } from './types/EventAttendee';
export type { EventOrganizer } from './types/EventOrganizer';
export type { EventCreator } from './types/EventCreator';
export type { Event } from './types/Event';
export type { CalendarListEntry } from './types/CalendarListEntry';
export type { Calendar } from './types/Calendar';
export type { CalendarList } from './types/CalendarList';
export type { Group } from './types/Group';
export type { Member } from './types/Member';
export type { Userinfo } from './types/Userinfo';

export interface GoogleScope {
  id: string;
  label: string;
  locked: boolean;
}

export const GOOGLE_SCOPES: GoogleScope[] = [
  { id: 'openid', label: 'OpenID', locked: true },
  {
    id: 'https://www.googleapis.com/auth/userinfo.email',
    label: 'Email',
    locked: true,
  },
  {
    id: 'https://www.googleapis.com/auth/userinfo.profile',
    label: 'Profile',
    locked: true,
  },
  {
    id: 'https://www.googleapis.com/auth/calendar.readonly',
    label: 'Calendars and events',
    locked: false,
  },
  {
    id: 'https://www.googleapis.com/auth/admin.directory.group.readonly',
    label: 'Groups',
    locked: false,
  },
];

export const MINIMUM_SCOPES: string[] = GOOGLE_SCOPES.filter(
  (s) => s.locked,
).map((s) => s.id);

export type { ValidationResult, Validator } from './validators/Validator';
export { unwrapValidationResult } from './validators/Validator';
export { GoogleCalendarListEntryValidator } from './validators/GoogleCalendarListEntryValidator';
export { GoogleCalendarListValidator } from './validators/GoogleCalendarListValidator';
export { GoogleCalendarValidator } from './validators/GoogleCalendarValidator';
export { GoogleEventAttendeeValidator } from './validators/GoogleEventAttendeeValidator';
export { GoogleEventCreatorValidator } from './validators/GoogleEventCreatorValidator';
export { GoogleEventDateTimeValidator } from './validators/GoogleEventDateTimeValidator';
export { GoogleEventValidator } from './validators/GoogleEventValidator';
export { GoogleEventOrganizerValidator } from './validators/GoogleEventOrganizerValidator';
export { GoogleEventReminderValidator } from './validators/GoogleEventReminderValidator';
export { GoogleGroupValidator } from './validators/GoogleGroupValidator';
export { GoogleGroupMemberValidator } from './validators/GoogleGroupMemberValidator';
export { GoogleUserinfoValidator } from './validators/GoogleUserinfoValidator';
