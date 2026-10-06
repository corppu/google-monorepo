import type { Request } from 'express';
import {
  GoogleCalendarService,
  GoogleEventService,
  GoogleGroupService,
  GooglePublicContactInfoService,
  GoogleUserService,
  MockGoogleCalendarRepository,
  MockGoogleEventRepository,
  MockGoogleGroupRepository,
  MockGooglePublicContactInfoRepository,
  MockGoogleUserRepository,
} from '@gm/lib-rest-google';
import type { Auth } from 'googleapis';

export const isMockRequest = (req: Pick<Request, 'query'>) =>
  req.query.mock === 'true';

// Shared so that mock creates/updates persist across requests.
const mockRepos = {
  calendar: new MockGoogleCalendarRepository(),
  contactInfo: new MockGooglePublicContactInfoRepository(),
  event: new MockGoogleEventRepository(),
  group: new MockGoogleGroupRepository(),
  user: new MockGoogleUserRepository(),
};

/** Builds the services with Mock*Repository when `mock` is set, otherwise with the real repositories. */
export function createGoogleServices(
  auth: () => Auth.OAuth2Client,
  mock: boolean,
) {
  if (mock) {
    return {
      calendars: new GoogleCalendarService(undefined, mockRepos.calendar),
      contactInfo: new GooglePublicContactInfoService(
        undefined,
        mockRepos.contactInfo,
      ),
      events: new GoogleEventService(undefined, mockRepos.event),
      groups: new GoogleGroupService(undefined, mockRepos.group),
      user: new GoogleUserService(undefined, mockRepos.user),
    };
  }
  const client = auth();
  return {
    calendars: new GoogleCalendarService(client),
    contactInfo: new GooglePublicContactInfoService(client),
    events: new GoogleEventService(client),
    groups: new GoogleGroupService(client),
    user: new GoogleUserService(client),
  };
}

export const googleServicesFor = (
  ctx: { auth: { authorizedClient(sid: string): Auth.OAuth2Client } },
  req: Pick<Request, 'query'>,
  sid: string | undefined,
) =>
  createGoogleServices(
    () => ctx.auth.authorizedClient(sid!),
    isMockRequest(req),
  );
