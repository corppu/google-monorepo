import type { EventOrganizer } from '../types/EventOrganizer';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleEventOrganizerMapper: RecordMapper<unknown, EventOrganizer> = (input) => {
  const rec = asRecord(input);
  return {
    email: asString(rec.email),
    displayName: asString(rec.displayName)
  };
};
