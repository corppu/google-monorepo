import type { CalendarList, Calendar } from '@gm/lib-common-google';
import type { Auth } from 'googleapis';

import {
  GoogleCalendarListValidator,
  GoogleCalendarValidator,
  unwrapValidationResult,
} from '@gm/lib-common-google';

import type { CalendarRepository } from '../repositories/interfaces';

import { GoogleCalendarListEntryFilter } from '../filters/GoogleCalendarListEntryFilter';
import { GoogleCalendarRepository } from '../repositories/GoogleCalendarRepository';

export class GoogleCalendarService {
  private repo: CalendarRepository;
  constructor(auth: Auth.OAuth2Client | undefined, repo?: CalendarRepository) {
    this.repo = repo ?? new GoogleCalendarRepository(auth!);
  }
  async get(id: string): Promise<Calendar> {
    return unwrapValidationResult(
      GoogleCalendarValidator(await this.repo.get(id)),
    );
  }
  async list(groupEmail?: string): Promise<CalendarList> {
    const list = unwrapValidationResult(
      GoogleCalendarListValidator(await this.repo.list(groupEmail)),
    );
    return { items: list.items.filter(GoogleCalendarListEntryFilter) };
  }
}
