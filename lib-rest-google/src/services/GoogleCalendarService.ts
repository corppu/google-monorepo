import type { Auth } from 'googleapis';
import type { CalendarList, Calendar } from '@gm/lib-common-google';
import { GoogleCalendarRepository } from '../repositories/GoogleCalendarRepository';
import {
  GoogleCalendarListValidator,
  GoogleCalendarValidator,
  unwrapValidationResult,
} from '@gm/lib-common-google';
import { GoogleCalendarListEntryFilter } from '../filters/GoogleCalendarListEntryFilter';

export class GoogleCalendarService {
  private repo: GoogleCalendarRepository;
  constructor(auth: Auth.OAuth2Client) {
    this.repo = new GoogleCalendarRepository(auth);
  }
  async list(): Promise<CalendarList> {
    const list = unwrapValidationResult(
      GoogleCalendarListValidator(await this.repo.list()),
    );
    return { items: list.items.filter(GoogleCalendarListEntryFilter) };
  }
  async get(id: string): Promise<Calendar> {
    return unwrapValidationResult(
      GoogleCalendarValidator(await this.repo.get(id)),
    );
  }
}
