import type { CalendarList } from '@gm/lib-common-google';
import { Form } from '@gm/lib-client-common';

export const GenericCalendarAccessForm = ({ calendars }: { calendars?: CalendarList }) => (
  <Form>
    <h2>Calendars</h2>
    <ul>{calendars?.items.map((c) => <li key={c.id}>{c.summary}</li>)}</ul>
  </Form>
);
