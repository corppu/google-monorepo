import type { Group } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleGroupMapper: RecordMapper<Record<string, any> | null | undefined, Group> = (r) => ({
  id: r?.id ?? undefined,
  email: r?.email ?? undefined,
  name: r?.name ?? undefined,
  description: r?.description ?? undefined
});
