import type { Event } from '@gm/lib-common-google';
import type { Auth } from 'googleapis';

import {
  GoogleEventValidator,
  unwrapValidationResult,
} from '@gm/lib-common-google';

import type { EventRepository } from '../repositories/interfaces';

import { GoogleEventFilter } from '../filters/GoogleEventFilter';
import { GoogleEventRepository } from '../repositories/GoogleEventRepository';

export class GoogleEventService {
  private repo: EventRepository;
  constructor(auth: Auth.OAuth2Client | undefined, repo?: EventRepository) {
    this.repo = repo ?? new GoogleEventRepository(auth!);
  }
  async create(calendarId: string, event: Event): Promise<Event> {
    return unwrapValidationResult(
      GoogleEventValidator(await this.repo.create(calendarId, event)),
    );
  }
  async list(calendarId?: string): Promise<Event[]> {
    return (await this.repo.list(calendarId))
      .map((input) => unwrapValidationResult(GoogleEventValidator(input)))
      .filter(GoogleEventFilter);
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
