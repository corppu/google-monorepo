import { ChunkedList, SectionFieldset } from '@gm/lib-client-common';
import type { CalendarList } from '@gm/lib-common-google';

export const GoogleCalendarSectionFieldset = ({
  calendars,
  onSelect,
  paginationKey,
  selectedCalendarId = '',
}: {
  calendars?: CalendarList;
  onSelect?: (calendarId: string) => void;
  paginationKey?: string;
  selectedCalendarId?: string;
}) => {
  const calendarItems =
    calendars?.items.filter((calendar) => calendar.id) ?? [];

  return (
    <SectionFieldset legend="Calendars">
      <ChunkedList
        ariaLabel="Calendars"
        getKey={(calendar) => calendar.id!}
        items={calendarItems}
        key={paginationKey}
        selectedKey={onSelect ? selectedCalendarId : undefined}
        renderItem={(calendar) =>
          calendar.id && onSelect ? (
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
          )
        }
      />
    </SectionFieldset>
  );
};
