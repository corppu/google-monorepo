import type { CalendarList } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleCalendars = () => useApi<CalendarList>('calendars');
