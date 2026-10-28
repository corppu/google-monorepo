import type { Event } from '@gm/lib-common-google';

import type { NativeApiConfig } from './useApi';

import { useApi } from './useApi';

export const useGoogleEvents = (cfg: NativeApiConfig) =>
  useApi<Event[]>(cfg, 'events');
