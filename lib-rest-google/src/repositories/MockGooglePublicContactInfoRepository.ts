import type { GooglePublicContactInfo } from '@gm/lib-common-google';
import type { PublicContactInfoRepository } from './interfaces';

export class MockGooglePublicContactInfoRepository implements PublicContactInfoRepository {
  async get(): Promise<GooglePublicContactInfo> {
    return {
      addresses: ['1 Example Street, Helsinki, Finland'],
      calendarUrls: ['https://calendar.example.com/morgan.lee'],
      emailAddresses: ['morgan.lee@example.com'],
      imClients: ['morgan.lee'],
      phoneNumbers: ['+358 40 000 0000'],
      sipAddresses: [],
      urls: ['https://example.com/morgan.lee'],
    };
  }
}
