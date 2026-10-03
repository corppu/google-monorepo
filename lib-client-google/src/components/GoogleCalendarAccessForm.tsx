import type { CalendarList } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-client-common';

export const GoogleCalendarAccessForm = ({
  calendars,
}: {
  calendars?: CalendarList;
}) => (
  <GenericForm>
    <h2>Calendars</h2>
    <ul>
      {calendars?.items.map((c) => (
        <li key={c.id}>{c.summary}</li>
      ))}
    </ul>
  </GenericForm>
);
