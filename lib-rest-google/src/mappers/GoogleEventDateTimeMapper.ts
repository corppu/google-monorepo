import type { EventDateTime } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleEventDateTimeMapper: RecordMapper<Record<string, any> | null | undefined, EventDateTime> = (r) => ({
  date: r?.date ?? undefined,
  dateTime: r?.dateTime ?? undefined,
  timeZone: r?.timeZone ?? undefined
});
