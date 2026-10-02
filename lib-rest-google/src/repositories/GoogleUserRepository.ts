import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export class GoogleUserRepository {
  constructor(private auth: Auth.OAuth2Client) {}
  async get(): Promise<Record<string, any>> {
    return (await google.oauth2({ version: 'v2', auth: this.auth }).userinfo.get()).data;
  }
}
