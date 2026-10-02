import type { EventAttendee } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleEventAttendeeMapper: RecordMapper<Record<string, any> | null | undefined, EventAttendee> = (r) => ({
  email: r?.email ?? undefined,
  displayName: r?.displayName ?? undefined,
  responseStatus: r?.responseStatus ?? undefined
});
