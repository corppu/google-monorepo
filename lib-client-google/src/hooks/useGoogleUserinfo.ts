import type { Userinfo } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleUserinfo = (enabled = true) =>
  useApi<Userinfo>('userinfo', enabled);
