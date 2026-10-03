import type { CalendarList } from '../types/CalendarList';
import { ArrayValidator, ObjectValidator, type Validator } from './Validator';
import { GoogleCalendarListEntryValidator } from './GoogleCalendarListEntryValidator';

export const GoogleCalendarListValidator: Validator<CalendarList> = ObjectValidator<CalendarList>('CalendarList', {
  items: ArrayValidator('items', GoogleCalendarListEntryValidator)
});