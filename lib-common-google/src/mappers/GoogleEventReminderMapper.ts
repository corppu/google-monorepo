import type { EventReminder } from '../types/EventReminder';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asNumber, asString } from './guards';

export const GoogleEventReminderMapper: RecordMapper<unknown, EventReminder> = (input) => {
  const rec = asRecord(input);
  return {
    method: asString(rec.method),
    minutes: asNumber(rec.minutes)
  };
};
