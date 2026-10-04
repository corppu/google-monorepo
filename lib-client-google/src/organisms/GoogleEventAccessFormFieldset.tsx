import type { Event } from '@gm/lib-common-google';

export const GoogleEventAccessFormFieldset = ({
  events,
  onSelect,
  selectedEventId = '',
}: {
  events?: Event[];
  onSelect?: (eventId: string) => void;
  selectedEventId?: string;
}) => (
  <fieldset>
    <legend>Events</legend>
    <ul>
      {events?.map((event) =>
        event.id ? (
          <li key={event.id}>
            {onSelect ? (
              <label>
                <input
                  type="radio"
                  name="google-event"
                  value={event.id}
                  checked={selectedEventId === event.id}
                  onChange={() => onSelect(event.id!)}
                />
                {event.summary ?? event.id}
              </label>
            ) : (
              (event.summary ?? event.id)
            )}
          </li>
        ) : null,
      )}
    </ul>
  </fieldset>
);
