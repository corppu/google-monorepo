import type { Request } from 'express';
import {
  GoogleCalendarService,
  GoogleEventService,
  GoogleGroupService,
  GooglePublicContactInfoService,
  GoogleUserService,
  createMockGoogleServices,
} from '@gm/lib-rest-google';
import type { Auth } from 'googleapis';

export const isMockRequest = (req: Pick<Request, 'query'>) =>
  req.query.mock === 'true';

/** Builds the services with Mock*Repository when `mock` is set, otherwise with the real repositories. */
export function createGoogleServices(
  auth: () => Auth.OAuth2Client,
  mock: boolean,
) {
  if (mock) return createMockGoogleServices();
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
  ctx:
    { auth: { authorizedClient(sid: string): Auth.OAuth2Client } } | undefined,
  req: Pick<Request, 'query'>,
  sid: string | undefined,
) =>
  createGoogleServices(
    () => ctx!.auth.authorizedClient(sid!),
    isMockRequest(req),
  );
