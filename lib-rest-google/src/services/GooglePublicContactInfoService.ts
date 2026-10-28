import type { GooglePublicContactInfo } from '@gm/lib-common-google';
import type { Auth } from 'googleapis';

import type { PublicContactInfoRepository } from '../repositories/interfaces';

import { GooglePublicContactInfoRepository } from '../repositories/GooglePublicContactInfoRepository';

export class GooglePublicContactInfoService {
  private repo: PublicContactInfoRepository;

  constructor(
    auth: Auth.OAuth2Client | undefined,
    repo?: PublicContactInfoRepository,
  ) {
    this.repo = repo ?? new GooglePublicContactInfoRepository(auth!);
  }

  get(): Promise<GooglePublicContactInfo> {
    return this.repo.get();
  }
}
