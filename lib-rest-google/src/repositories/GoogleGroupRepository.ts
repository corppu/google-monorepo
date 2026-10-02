import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleGroupRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async list(customer = 'my_customer'): Promise<Record<string, any>[]> {
    const res = await google.admin({ version: 'directory_v1', auth: this.auth }).groups.list({ customer });
    return res.data.groups ?? [];
  }
  async members(groupKey: string): Promise<Record<string, any>[]> {
    const res = await google.admin({ version: 'directory_v1', auth: this.auth }).members.list({ groupKey });
    return res.data.members ?? [];
  }
}
