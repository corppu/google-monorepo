import type { Auth } from 'googleapis';
import type { GooglePublicContactInfo } from '@gm/lib-common-google';
import { GooglePublicContactInfoRepository } from '../repositories/GooglePublicContactInfoRepository';

export class GooglePublicContactInfoService {
  private repo: GooglePublicContactInfoRepository;

  constructor(auth: Auth.OAuth2Client) {
    this.repo = new GooglePublicContactInfoRepository(auth);
  }

  get(): Promise<GooglePublicContactInfo> {
    return this.repo.get();
  }
}
