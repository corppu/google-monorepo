import type { EventReminder } from '@gm/lib-common-google';
import type { RecordMapper } from './RecordMapper';

export const GoogleEventReminderMapper: RecordMapper<Record<string, any> | null | undefined, EventReminder> = (r) => ({
  method: r?.method ?? undefined,
  minutes: r?.minutes ?? undefined
});
