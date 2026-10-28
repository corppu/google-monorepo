import type { Userinfo } from '@gm/lib-common-google';

import type { NativeApiConfig } from './useApi';

import { useApi } from './useApi';

export const useGoogleUserinfo = (cfg: NativeApiConfig) =>
  useApi<Userinfo>(cfg, 'userinfo');
