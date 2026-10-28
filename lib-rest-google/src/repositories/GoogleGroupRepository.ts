import type { Auth } from 'googleapis';

import { google } from 'googleapis';

import type { GroupRepository } from './interfaces';

export class GoogleGroupRepository implements GroupRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(customer = 'my_customer'): Promise<Record<string, any>[]> {
    const res = await google
      .admin({ auth: this.auth, version: 'directory_v1' })
      .groups.list({ customer });
    return res.data.groups ?? [];
  }
  async members(groupKey: string): Promise<Record<string, any>[]> {
    const res = await google
      .admin({ auth: this.auth, version: 'directory_v1' })
      .members.list({ groupKey });
    return res.data.members ?? [];
  }
}
