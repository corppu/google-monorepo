import { ChunkedList } from '@gm/lib-client-common';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
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
      {onSelect && (
        <div className="gm-google-access-fieldset__create-event">
          <label>
            <input
              checked={selectedEventId === CREATE_EVENT_OPTION_ID}
              name="google-event"
              onChange={() => onSelect(CREATE_EVENT_OPTION_ID)}
              type="radio"
              value={CREATE_EVENT_OPTION_ID}
            />
            Create event
          </label>
        </div>
      )}
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
