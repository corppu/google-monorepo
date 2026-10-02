import type { Calendar } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleCalendarMapper: RecordMapper<Record<string, any> | null | undefined, Calendar> = (r) => ({
  id: r?.id ?? undefined,
  summary: r?.summary ?? undefined,
  description: r?.description ?? undefined,
  timeZone: r?.timeZone ?? undefined
});
