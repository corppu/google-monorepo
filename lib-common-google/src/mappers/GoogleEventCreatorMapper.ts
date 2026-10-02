import type { EventCreator } from '../types/EventCreator';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleEventCreatorMapper: RecordMapper<unknown, EventCreator> = (input) => {
  const rec = asRecord(input);
  return {
    email: asString(rec.email),
    displayName: asString(rec.displayName)
  };
};
