import type { Event } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleEvents = () => useApi<Event[]>('events');
