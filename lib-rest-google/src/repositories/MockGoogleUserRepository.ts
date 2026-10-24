import { MOCK_USERINFO } from '@gm/lib-common-google';
import type { UserRepository } from './interfaces';

export class MockGoogleUserRepository implements UserRepository {
  // The userinfo validator only accepts gmail addresses.
  async get(): Promise<Record<string, any>> {
    return { ...structuredClone(MOCK_USERINFO), email: 'morgan.lee@gmail.com' };
  }
}
