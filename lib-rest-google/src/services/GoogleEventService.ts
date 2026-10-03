import type { Auth } from 'googleapis';
import type { Event } from '@gm/lib-common-google';
import { GoogleEventRepository } from '../repositories/GoogleEventRepository';
import { GoogleEventValidator, unwrapValidationResult } from '@gm/lib-common-google';
import { GoogleEventFilter } from '../filters/GoogleEventFilter';

export class GoogleEventService {
  private repo: GoogleEventRepository;
  constructor(auth: Auth.OAuth2Client) {
    this.repo = new GoogleEventRepository(auth);
  }
  async list(calendarId?: string): Promise<Event[]> {
    return (await this.repo.list(calendarId))
      .map((input) => unwrapValidationResult(GoogleEventValidator(input)))
      .filter(GoogleEventFilter);
  }
}
