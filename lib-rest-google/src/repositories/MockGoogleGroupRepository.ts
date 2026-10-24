import { MOCK_GROUPS } from '@gm/lib-common-google';
import type { GroupRepository } from './interfaces';

const MOCK_MEMBERS: Record<string, Record<string, any>[]> = {
  operations: [{ email: 'morgan.lee@example.com', id: 'm1', role: 'OWNER' }],
  'product-team': [
    { email: 'morgan.lee@example.com', id: 'm1', role: 'OWNER' },
    { email: 'sam.rivera@example.com', id: 'm2', role: 'MEMBER' },
  ],
};

export class MockGoogleGroupRepository implements GroupRepository {
  async list(): Promise<Record<string, any>[]> {
    return structuredClone(MOCK_GROUPS);
  }
  async members(groupKey: string): Promise<Record<string, any>[]> {
    const group = MOCK_GROUPS.find(
      (g) => g.id === groupKey || g.email === groupKey,
    );
    return structuredClone(MOCK_MEMBERS[group?.id ?? groupKey] ?? []);
  }
}
