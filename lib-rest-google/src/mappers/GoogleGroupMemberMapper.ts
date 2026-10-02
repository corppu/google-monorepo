import type { Member } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleGroupMemberMapper: RecordMapper<Record<string, any> | null | undefined, Member> = (r) => ({
  id: r?.id ?? undefined,
  email: r?.email ?? undefined,
  role: r?.role ?? undefined
});
