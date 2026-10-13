import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import type { Event } from '@gm/lib-common-google';
import { ensurePgSchema, getPgPool } from '../db/pg';
import type { EventRepository } from './interfaces';

export class PgGoogleEventRepository implements EventRepository {
  constructor(private db: Pool = getPgPool()) {}

  async list(calendarId = 'primary'): Promise<Record<string, any>[]> {
    await ensurePgSchema(this.db);
    const { rows } = await this.db.query(
      'SELECT data FROM google_events WHERE calendar_id = $1 ORDER BY position',
      [calendarId],
    );
    return rows.map((r) => r.data);
  }

  async create(calendarId: string, event: Event): Promise<Record<string, any>> {
    await ensurePgSchema(this.db);
    const created: Event = {
      ...event,
      id: event.id ?? `event-${randomUUID()}`,
    };
    await this.db.query(
      'INSERT INTO google_events (calendar_id, id, data) VALUES ($1, $2, $3)',
      [calendarId, created.id, JSON.stringify(created)],
    );
    return created;
  }

  async update(
    calendarId: string,
    eventId: string,
    changes: Pick<Event, 'description' | 'summary'>,
  ): Promise<Record<string, any>> {
    await ensurePgSchema(this.db);
    const { rows } = await this.db.query(
      `UPDATE google_events SET data = data || $3::jsonb
       WHERE calendar_id = $1 AND id = $2 RETURNING data`,
      [calendarId, eventId, JSON.stringify(changes)],
    );
    if (!rows[0]) throw new Error(`Event not found: ${eventId}`);
    return rows[0].data;
  }
}
