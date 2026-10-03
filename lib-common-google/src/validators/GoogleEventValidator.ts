import type { Event } from '../types/Event';
import { ArrayValidator, BooleanValidator, NullableValidator, ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';
import { GoogleEventAttendeeValidator } from './GoogleEventAttendeeValidator';
import { GoogleEventCreatorValidator } from './GoogleEventCreatorValidator';
import { GoogleEventDateTimeValidator } from './GoogleEventDateTimeValidator';
import { GoogleEventOrganizerValidator } from './GoogleEventOrganizerValidator';
import { GoogleEventReminderValidator } from './GoogleEventReminderValidator';

const optionalString = (fieldKey: string) => OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

type EventReminders = NonNullable<Event['reminders']>;
const eventRemindersValidator: Validator<EventReminders> = ObjectValidator<EventReminders>('reminders', {
  useDefault: OptionalValidator(BooleanValidator('useDefault')),
  overrides: OptionalValidator(ArrayValidator('overrides', GoogleEventReminderValidator))
});

export const GoogleEventValidator: Validator<Event> = ObjectValidator<Event>('Event', {
  id: optionalString('id'),
  summary: optionalString('summary'),
  description: optionalString('description'),
  location: optionalString('location'),
  start: OptionalValidator(GoogleEventDateTimeValidator),
  end: OptionalValidator(GoogleEventDateTimeValidator),
  reminders: OptionalValidator(NullableValidator(eventRemindersValidator)),
  attendees: OptionalValidator(ArrayValidator('attendees', GoogleEventAttendeeValidator)),
  organizer: OptionalValidator(NullableValidator(GoogleEventOrganizerValidator)),
  creator: OptionalValidator(NullableValidator(GoogleEventCreatorValidator))
});