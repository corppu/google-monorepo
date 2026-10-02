import type { Userinfo } from '@gm/lib-common-google';
import { useApi } from './useApi';
import type { NativeApiConfig } from './useApi';

export const useGoogleUserinfo = (cfg: NativeApiConfig) => useApi<Userinfo>(cfg, 'userinfo');
