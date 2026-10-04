import type { CalendarList } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleCalendars = (groupEmail?: string) =>
  useApi<CalendarList>(
    groupEmail
      ? `calendars?groupEmail=${encodeURIComponent(groupEmail)}`
      : 'calendars',
  );
