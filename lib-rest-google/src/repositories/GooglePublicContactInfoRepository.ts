import { google } from 'googleapis';
import type { Auth } from 'googleapis';
import type { GooglePublicContactInfo } from '@gm/lib-common-google';

const nonEmptyValues = (values: Array<string | null | undefined>) =>
  values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

export class GooglePublicContactInfoRepository {
  constructor(private auth: Auth.OAuth2Client) {}

  async get(): Promise<GooglePublicContactInfo> {
    const { data } = await google
      .people({ auth: this.auth, version: 'v1' })
      .people.get({
        personFields:
          'addresses,calendarUrls,emailAddresses,imClients,phoneNumbers,sipAddresses,urls',
        resourceName: 'people/me',
        sources: ['PROFILE'],
      });

    return {
      addresses:
        data.addresses?.flatMap((address) =>
          nonEmptyValues([
            address.formattedValue?.trim() ||
              [
                address.streetAddress,
                address.extendedAddress,
                address.city,
                address.region,
                address.postalCode,
                address.country,
              ]
                .filter(Boolean)
                .join(', '),
          ]),
        ) ?? [],
      calendarUrls:
        data.calendarUrls?.flatMap((url) => nonEmptyValues([url.url])) ?? [],
      emailAddresses:
        data.emailAddresses?.flatMap((email) =>
          nonEmptyValues([email.value]),
        ) ?? [],
      imClients:
        data.imClients?.flatMap((client) =>
          nonEmptyValues([client.username]),
        ) ?? [],
      phoneNumbers:
        data.phoneNumbers?.flatMap((phone) => nonEmptyValues([phone.value])) ??
        [],
      sipAddresses:
        data.sipAddresses?.flatMap((address) =>
          nonEmptyValues([address.value]),
        ) ?? [],
      urls: data.urls?.flatMap((url) => nonEmptyValues([url.value])) ?? [],
    };
  }
}
