import type { Event } from '../types/Event';
import {
  ArrayValidator,
  BooleanValidator,
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';
import { GoogleEventAttendeeValidator } from './GoogleEventAttendeeValidator';
import { GoogleEventCreatorValidator } from './GoogleEventCreatorValidator';
import { GoogleEventDateTimeValidator } from './GoogleEventDateTimeValidator';
import { GoogleEventOrganizerValidator } from './GoogleEventOrganizerValidator';
import { GoogleEventReminderValidator } from './GoogleEventReminderValidator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

type EventReminders = NonNullable<Event['reminders']>;
const eventRemindersValidator: Validator<EventReminders> =
  ObjectValidator<EventReminders>('reminders', {
    overrides: OptionalValidator(
      ArrayValidator('overrides', GoogleEventReminderValidator),
    ),
    useDefault: OptionalValidator(BooleanValidator('useDefault')),
  });

export const GoogleEventValidator: Validator<Event> = ObjectValidator<Event>(
  'Event',
  {
    attendees: OptionalValidator(
      ArrayValidator('attendees', GoogleEventAttendeeValidator),
    ),
    creator: OptionalValidator(NullableValidator(GoogleEventCreatorValidator)),
    description: optionalString('description'),
    end: OptionalValidator(GoogleEventDateTimeValidator),
    id: optionalString('id'),
    location: optionalString('location'),
    organizer: OptionalValidator(
      NullableValidator(GoogleEventOrganizerValidator),
    ),
    reminders: OptionalValidator(NullableValidator(eventRemindersValidator)),
    start: OptionalValidator(GoogleEventDateTimeValidator),
    summary: optionalString('summary'),
  },
);
