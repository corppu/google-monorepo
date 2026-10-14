import type { CalendarListEntry } from '../types/CalendarListEntry';
import {
  BooleanValidator,
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleCalendarListEntryValidator: Validator<CalendarListEntry> =
  ObjectValidator<CalendarListEntry>('CalendarListEntry', {
    accessRole: optionalString('accessRole'),
    id: optionalString('id'),
    primary: OptionalValidator(NullableValidator(BooleanValidator('primary'))),
    summary: optionalString('summary'),
  });
