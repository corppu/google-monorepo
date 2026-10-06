import { MOCK_USERINFO } from '@gm/lib-common-google';
import type { UserRepository } from './interfaces';

export class MockGoogleUserRepository implements UserRepository {
  async get(): Promise<Record<string, any>> {
    return structuredClone(MOCK_USERINFO);
  }
}
