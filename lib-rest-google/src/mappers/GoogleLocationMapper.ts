import type { Location } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleLocationMapper: RecordMapper<Record<string, any> | null | undefined, Location> = (r) => ({
  name: r?.name ?? undefined,
  address: r?.address ?? undefined
});
