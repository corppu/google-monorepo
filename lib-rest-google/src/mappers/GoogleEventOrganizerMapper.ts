import type { EventOrganizer } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleEventOrganizerMapper: RecordMapper<Record<string, any> | null | undefined, EventOrganizer> = (r) => ({
  email: r?.email ?? undefined,
  displayName: r?.displayName ?? undefined
});
