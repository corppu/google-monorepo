import type { Userinfo } from '../types/Userinfo';
import type { RecordMapper } from './RecordMapper';
import { asRecord, asString } from './guards';

export const GoogleUserinfoMapper: RecordMapper<unknown, Userinfo> = (input) => {
  const rec = asRecord(input);
  return {
    id: asString(rec.id),
    email: asString(rec.email),
    name: asString(rec.name),
    picture: asString(rec.picture)
  };
};
