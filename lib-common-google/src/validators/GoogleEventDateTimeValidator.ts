import type { EventDateTime } from '../types/EventDateTime';
import { NullableValidator, ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';

const optionalString = (fieldKey: string) => OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleEventDateTimeValidator: Validator<EventDateTime> = ObjectValidator<EventDateTime>('EventDateTime', {
  date: optionalString('date'),
  dateTime: optionalString('dateTime'),
  timeZone: optionalString('timeZone')
});