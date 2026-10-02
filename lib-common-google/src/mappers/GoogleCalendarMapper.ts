import type { Calendar } from '../types/Calendar';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleCalendarMapper: RecordMapper<unknown, Calendar> = (input) => {
  const rec = asRecord(input);
  return {
    id: asString(rec.id),
    summary: asString(rec.summary),
    description: asString(rec.description),
    timeZone: asString(rec.timeZone)
  };
};
