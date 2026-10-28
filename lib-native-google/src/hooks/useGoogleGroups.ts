import type { Group } from '@gm/lib-common-google';

import type { NativeApiConfig } from './useApi';

import { useApi } from './useApi';

export const useGoogleGroups = (cfg: NativeApiConfig) =>
  useApi<Group[]>(cfg, 'groups');
