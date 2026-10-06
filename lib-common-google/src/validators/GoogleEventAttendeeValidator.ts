import type { EventAttendee } from '../types/EventAttendee';
import {
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleEventAttendeeValidator: Validator<EventAttendee> =
  ObjectValidator<EventAttendee>('EventAttendee', {
    displayName: optionalString('displayName'),
    email: optionalString('email'),
    responseStatus: optionalString('responseStatus'),
  });
