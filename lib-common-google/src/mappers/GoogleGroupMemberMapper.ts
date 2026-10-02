import type { Member } from '../types/Member';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleGroupMemberMapper: RecordMapper<unknown, Member> = (input) => {
  const rec = asRecord(input);
  return {
    id: asString(rec.id),
    email: asString(rec.email),
    role: asString(rec.role)
  };
};
