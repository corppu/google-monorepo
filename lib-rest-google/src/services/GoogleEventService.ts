import type { EventRepository } from '../repositories/interfaces';
import type { Auth } from 'googleapis';
import type { Event } from '@gm/lib-common-google';
import { GoogleEventRepository } from '../repositories/GoogleEventRepository';
import {
  GoogleEventValidator,
  unwrapValidationResult,
} from '@gm/lib-common-google';
import { GoogleEventFilter } from '../filters/GoogleEventFilter';

export class GoogleEventService {
  private repo: EventRepository;
  constructor(auth: Auth.OAuth2Client | undefined, repo?: EventRepository) {
    this.repo = repo ?? new GoogleEventRepository(auth!);
  }
  async list(calendarId?: string): Promise<Event[]> {
    return (await this.repo.list(calendarId))
      .map((input) => unwrapValidationResult(GoogleEventValidator(input)))
      .filter(GoogleEventFilter);
  }
  async create(calendarId: string, event: Event): Promise<Event> {
    return unwrapValidationResult(
      GoogleEventValidator(await this.repo.create(calendarId, event)),
    );
  }
  async update(
    calendarId: string,
    eventId: string,
    changes: Pick<Event, 'description' | 'summary'>,
  ): Promise<Event> {
    return unwrapValidationResult(
      GoogleEventValidator(
        await this.repo.update(calendarId, eventId, changes),
      ),
    );
  }
}
