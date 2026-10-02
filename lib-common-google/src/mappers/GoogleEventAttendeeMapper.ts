import type { EventAttendee } from '../types/EventAttendee';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleEventAttendeeMapper: RecordMapper<unknown, EventAttendee> = (input) => {
  const rec = asRecord(input);
  return {
    email: asString(rec.email),
    displayName: asString(rec.displayName),
    responseStatus: asString(rec.responseStatus)
  };
};
