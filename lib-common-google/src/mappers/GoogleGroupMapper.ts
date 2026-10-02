import type { Group } from '../types/Group';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleGroupMapper: RecordMapper<unknown, Group> = (input) => {
  const rec = asRecord(input);
  return {
    id: asString(rec.id),
    email: asString(rec.email),
    name: asString(rec.name),
    description: asString(rec.description)
  };
};
