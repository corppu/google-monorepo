import { hasDatabase } from './db/pg';
import { PgGoogleEventRepository } from './repositories/PgGoogleEventRepository';
import { MockGoogleCalendarRepository } from './repositories/MockGoogleCalendarRepository';
import { MockGoogleEventRepository } from './repositories/MockGoogleEventRepository';
import { MockGoogleGroupRepository } from './repositories/MockGoogleGroupRepository';
import { MockGooglePublicContactInfoRepository } from './repositories/MockGooglePublicContactInfoRepository';
import { MockGoogleUserRepository } from './repositories/MockGoogleUserRepository';
import { GoogleCalendarService } from './services/GoogleCalendarService';
import { GoogleEventService } from './services/GoogleEventService';
import { GoogleGroupService } from './services/GoogleGroupService';
import { GooglePublicContactInfoService } from './services/GooglePublicContactInfoService';
import { GoogleUserService } from './services/GoogleUserService';

// Process-wide repositories so mock creates/updates persist between requests.
// With DATABASE_URL set, events live in PostgreSQL so all replicas share them.
const repositories = {
  calendar: new MockGoogleCalendarRepository(),
  contactInfo: new MockGooglePublicContactInfoRepository(),
  event: hasDatabase()
    ? new PgGoogleEventRepository()
    : new MockGoogleEventRepository(),
  group: new MockGoogleGroupRepository(),
  user: new MockGoogleUserRepository(),
};

export function createMockGoogleServices() {
  return {
    calendars: new GoogleCalendarService(undefined, repositories.calendar),
    contactInfo: new GooglePublicContactInfoService(
      undefined,
      repositories.contactInfo,
    ),
    events: new GoogleEventService(undefined, repositories.event),
    groups: new GoogleGroupService(undefined, repositories.group),
    user: new GoogleUserService(undefined, repositories.user),
  };
}
