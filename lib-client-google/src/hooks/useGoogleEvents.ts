import type { Event } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleEvents = (calendarId?: string, enabled = true) => {
  const query = calendarId
    ? `?calendarId=${encodeURIComponent(calendarId)}`
    : '';
  return useApi<Event[]>(`events${query}`, enabled);
};
