import type { CalendarList } from '@gm/lib-common-google';

import type { NativeApiConfig } from './useApi';

import { useApi } from './useApi';

export const useGoogleCalendars = (cfg: NativeApiConfig) =>
  useApi<CalendarList>(cfg, 'calendars');
