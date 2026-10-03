import type { Event } from '@gm/lib-common-google';
import { useApi } from './useApi';
import type { NativeApiConfig } from './useApi';

export const useGoogleEvents = (cfg: NativeApiConfig) =>
  useApi<Event[]>(cfg, 'events');
