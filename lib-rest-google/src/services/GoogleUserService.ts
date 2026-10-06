import type { UserRepository } from '../repositories/interfaces';
import type { Auth } from 'googleapis';
import type { Userinfo } from '@gm/lib-common-google';
import { GoogleUserRepository } from '../repositories/GoogleUserRepository';
import {
  GoogleUserinfoValidator,
  unwrapValidationResult,
} from '@gm/lib-common-google';

export class GoogleUserService {
  private repo: UserRepository;
  constructor(auth: Auth.OAuth2Client | undefined, repo?: UserRepository) {
    this.repo = repo ?? new GoogleUserRepository(auth!);
  }
  async get(): Promise<Userinfo> {
    return unwrapValidationResult(
      GoogleUserinfoValidator(await this.repo.get()),
    );
  }
}
