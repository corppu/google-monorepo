import type { Auth } from 'googleapis';
import type { Userinfo } from '@gm/lib-common-google';
import { GoogleUserRepository } from '../repositories/GoogleUserRepository';
import { GoogleUserinfoMapper } from '@gm/lib-common-google';

export class GoogleUserService {
  private repo: GoogleUserRepository;
  constructor(auth: Auth.OAuth2Client) {
    this.repo = new GoogleUserRepository(auth);
  }
  async get(): Promise<Userinfo> {
    return GoogleUserinfoMapper(await this.repo.get());
  }
}
