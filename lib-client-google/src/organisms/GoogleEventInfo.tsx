import type { Event } from '@gm/lib-common-google';
import { FeedItem } from '@gm/lib-client-common';

const formatDateTime = (dateTime?: string | null, date?: string | null) => {
  if (dateTime) {
    const parsedDateTime = new Date(dateTime);
    if (!Number.isNaN(parsedDateTime.getTime())) {
      return {
        dateTimeISO: dateTime,
        dateTimeLocalized: parsedDateTime.toLocaleString(),
      };
    }
  }
  if (date) {
    const parsedDate = new Date(`${date}T00:00:00`);
    if (!Number.isNaN(parsedDate.getTime())) {
      return {
        dateTimeISO: date,
        dateTimeLocalized: parsedDate.toLocaleDateString(),
      };
    }
  }
  return undefined;
};

export const GoogleEventInfo = ({ event }: { event: Event }) => {
  const start = formatDateTime(event.start?.dateTime, event.start?.date);
  const end = formatDateTime(event.end?.dateTime, event.end?.date);
  const location = event.location?.trim();

  return (
    <FeedItem
      dateTimeEndLocalized={end?.dateTimeLocalized}
      dateTimeISO={start?.dateTimeISO}
      dateTimeLocalized={start?.dateTimeLocalized}
      description={event.description}
      locationHref={
        location
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
          : undefined
      }
      locationText={location}
      title={event.summary ?? ''}
    />
  );
};
