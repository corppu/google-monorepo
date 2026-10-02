import type { EventCreator } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleEventCreatorMapper: RecordMapper<Record<string, any> | null | undefined, EventCreator> = (r) => ({
  email: r?.email ?? undefined,
  displayName: r?.displayName ?? undefined
});
