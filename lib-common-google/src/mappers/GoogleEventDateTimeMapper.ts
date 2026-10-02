import type { EventDateTime } from '../types/EventDateTime';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleEventDateTimeMapper: RecordMapper<unknown, EventDateTime> = (input) => {
  const rec = asRecord(input);
  return {
    date: asString(rec.date),
    dateTime: asString(rec.dateTime),
    timeZone: asString(rec.timeZone)
  };
};
