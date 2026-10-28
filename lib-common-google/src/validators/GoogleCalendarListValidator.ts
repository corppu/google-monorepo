import type { CalendarList } from '../types/CalendarList';

import { GoogleCalendarListEntryValidator } from './GoogleCalendarListEntryValidator';
import { ArrayValidator, ObjectValidator, type Validator } from './Validator';

export const GoogleCalendarListValidator: Validator<CalendarList> =
  ObjectValidator<CalendarList>('CalendarList', {
    items: ArrayValidator('items', GoogleCalendarListEntryValidator),
  });
