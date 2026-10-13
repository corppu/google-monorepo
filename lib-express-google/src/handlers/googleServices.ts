import type { Request } from 'express';
import { isMockRequest } from '@gm/lib-express-auth';
import {
  GoogleCalendarService,
  GoogleEventService,
  GoogleGroupService,
  GooglePublicContactInfoService,
  GoogleUserService,
  createMockGoogleServices,
} from '@gm/lib-rest-google';
import type { Auth } from 'googleapis';

/** Builds the services with Mock*Repository when `mock` is set, otherwise with the real repositories. */
export async function createGoogleServices(
  auth: () => Promise<Auth.OAuth2Client>,
  mock: boolean,
) {
  if (mock) return createMockGoogleServices();
  const client = await auth();
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
    | { auth: { authorizedClient(sid: string): Promise<Auth.OAuth2Client> } }
    | undefined,
  req: Pick<Request, 'query'>,
  sid: string | undefined,
) =>
  createGoogleServices(
    () => ctx!.auth.authorizedClient(sid!),
    isMockRequest(req),
  );
