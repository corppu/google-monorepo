import { Pool } from 'pg';
import { MOCK_EVENTS } from '@gm/lib-common-google';

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/** Shared pool for the process, configured by DATABASE_URL. */
export function getPgPool(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  return (pool ??= new Pool({ connectionString: process.env.DATABASE_URL }));
}

const SCHEMA_LOCK = 4242001;

/** Idempotent schema + seed; an advisory lock serialises replicas starting together. */
export function ensurePgSchema(db: Pool = getPgPool()): Promise<void> {
  return (schemaReady ??= (async () => {
    const client = await db.connect();
    try {
      await client.query('SELECT pg_advisory_lock($1)', [SCHEMA_LOCK]);
      await client.query('CREATE EXTENSION IF NOT EXISTS postgis');
      await client.query(`
        CREATE TABLE IF NOT EXISTS google_events (
          calendar_id text NOT NULL,
          id text NOT NULL,
          position bigserial,
          data jsonb NOT NULL,
          PRIMARY KEY (calendar_id, id)
        );
      `);
      for (const [calendarId, events] of Object.entries(MOCK_EVENTS)) {
        for (const event of events) {
          await client.query(
            `INSERT INTO google_events (calendar_id, id, data)
             VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
            [calendarId, event.id, JSON.stringify(event)],
          );
        }
      }
    } finally {
      await client
        .query('SELECT pg_advisory_unlock($1)', [SCHEMA_LOCK])
        .catch(() => undefined);
      client.release();
    }
  })().catch((e) => {
    schemaReady = undefined;
    throw e;
  }));
}
