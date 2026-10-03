import type { EventAttendee } from '../types/EventAttendee';
import { NullableValidator, ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';

const optionalString = (fieldKey: string) => OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleEventAttendeeValidator: Validator<EventAttendee> = ObjectValidator<EventAttendee>('EventAttendee', {
  email: optionalString('email'),
  displayName: optionalString('displayName'),
  responseStatus: optionalString('responseStatus')
});