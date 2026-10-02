import type { Userinfo } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleUserinfoMapper: RecordMapper<Record<string, any> | null | undefined, Userinfo> = (r) => ({
  id: r?.id ?? undefined,
  email: r?.email ?? undefined,
  name: r?.name ?? undefined,
  picture: r?.picture ?? undefined
});
