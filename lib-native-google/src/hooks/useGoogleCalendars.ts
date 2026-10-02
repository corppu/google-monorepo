import type { CalendarList } from '@gm/lib-common-google';
import { useApi } from './useApi';
import type { NativeApiConfig } from './useApi';

export const useGoogleCalendars = (cfg: NativeApiConfig) => useApi<CalendarList>(cfg, 'calendars');
