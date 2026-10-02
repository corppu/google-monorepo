import type { Group } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleGroups = () => useApi<Group[]>('groups');
