import type { CalendarListEntry } from '../types/CalendarListEntry';
import { BooleanValidator, NullableValidator, ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';

const optionalString = (fieldKey: string) => OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleCalendarListEntryValidator: Validator<CalendarListEntry> = ObjectValidator<CalendarListEntry>('CalendarListEntry', {
  id: optionalString('id'),
  summary: optionalString('summary'),
  primary: OptionalValidator(NullableValidator(BooleanValidator('primary'))),
  accessRole: optionalString('accessRole')
});