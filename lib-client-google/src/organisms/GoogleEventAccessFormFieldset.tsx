import { ChunkedList } from '@gm/lib-client-common';
import type { Event } from '@gm/lib-common-google';
import './GoogleAccessFormFieldset.css';

export const GoogleEventAccessFormFieldset = ({
  events,
  onSelect,
  paginationKey,
  selectedEventId = '',
}: {
  events?: Event[];
  onSelect?: (eventId: string) => void;
  paginationKey?: string;
  selectedEventId?: string;
}) => {
  const eventItems = events?.filter((event) => event.id) ?? [];

  return (
    <fieldset className="gm-google-access-fieldset">
      <legend className="gm-google-access-fieldset__legend">Events</legend>
      <ChunkedList
        ariaLabel="Events"
        getKey={(event) => event.id!}
        items={eventItems}
        key={paginationKey}
        selectedKey={onSelect ? selectedEventId : undefined}
        renderItem={(event) => {
          const eventLabel = event.summary?.trim() || event.id!;
          return onSelect ? (
            <label>
              <input
                type="radio"
                name="google-event"
                value={event.id!}
                checked={selectedEventId === event.id}
                onChange={() => onSelect(event.id!)}
              />
              {eventLabel}
            </label>
          ) : (
            eventLabel
          );
        }}
      />
    </fieldset>
  );
};
