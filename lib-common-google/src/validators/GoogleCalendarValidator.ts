import type { Calendar } from '../types/Calendar';
import {
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleCalendarValidator: Validator<Calendar> =
  ObjectValidator<Calendar>('Calendar', {
    description: optionalString('description'),
    id: optionalString('id'),
    summary: optionalString('summary'),
    timeZone: optionalString('timeZone'),
  });
