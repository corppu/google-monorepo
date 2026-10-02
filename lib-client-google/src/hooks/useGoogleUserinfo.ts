import type { Userinfo } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGoogleUserinfo = () => useApi<Userinfo>('userinfo');
