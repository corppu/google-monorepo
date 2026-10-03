import type { Group } from '@gm/lib-common-google';
import { useApi } from './useApi';
import type { NativeApiConfig } from './useApi';

export const useGoogleGroups = (cfg: NativeApiConfig) =>
  useApi<Group[]>(cfg, 'groups');
