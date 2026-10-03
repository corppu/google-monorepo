import type { EventReminder } from '../types/EventReminder';
import { NullableValidator, NumberValidator, ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';

const optionalString = (fieldKey: string) => OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleEventReminderValidator: Validator<EventReminder> = ObjectValidator<EventReminder>('EventReminder', {
  method: optionalString('method'),
  minutes: OptionalValidator(NullableValidator(NumberValidator('minutes')))
});