import type { GooglePublicContactInfo } from '@gm/lib-common-google';
import { useApi } from './useApi';

export const useGooglePublicContactInfo = (enabled = true) =>
  useApi<GooglePublicContactInfo>('public-contact-info', enabled);
