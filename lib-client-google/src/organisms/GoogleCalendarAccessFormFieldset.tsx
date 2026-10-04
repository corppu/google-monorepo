import type { CalendarList } from '@gm/lib-common-google';

export const GoogleCalendarAccessFormFieldset = ({
  calendars,
  onSelect,
  selectedCalendarId = '',
}: {
  calendars?: CalendarList;
  onSelect?: (calendarId: string) => void;
  selectedCalendarId?: string;
}) => (
  <fieldset>
    <legend>Calendars</legend>
    <ul>
      {calendars?.items.map((calendar) =>
        calendar.id ? (
          <li key={calendar.id}>
            {onSelect ? (
              <label>
                <input
                  type="radio"
                  name="google-calendar"
                  value={calendar.id}
                  checked={selectedCalendarId === calendar.id}
                  onChange={() => onSelect(calendar.id!)}
                />
                {calendar.summary ?? calendar.id}
              </label>
            ) : (
              (calendar.summary ?? calendar.id)
            )}
          </li>
        ) : null,
      )}
    </ul>
  </fieldset>
);
