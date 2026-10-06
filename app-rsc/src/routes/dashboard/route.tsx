import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import { createMockGoogleServices } from '@gm/lib-rest-google';
import { DashboardClient } from './DashboardClient';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const services = createMockGoogleServices();
  const groupEmail =
    url.searchParams.get('groupEmail') ?? 'product-team@example.com';
  const calendars = await services.calendars.list(groupEmail);
  const calendarId =
    url.searchParams.get('calendarId') ?? calendars.items[0]?.id ?? '';
  const [userinfo, groups, events] = await Promise.all([
    services.user.get(),
    services.groups.list(),
    calendarId ? services.events.list(calendarId) : [],
  ]);
  const eventId =
    url.searchParams.get('createEvent') === 'true'
      ? CREATE_EVENT_OPTION_ID
      : (url.searchParams.get('eventId') ?? events[0]?.id ?? '');
  return {
    data: {
      calendars,
      events,
      groups,
      selectedCalendarId: calendarId,
      selectedGroupEmail: groupEmail,
      userinfo,
    },
    eventId,
  };
}

// Server component: data comes from the services backed by the Mock*Repository
// classes, rendered to HTML on the server and hydrated by the client component.
export default function DashboardRoute({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <DashboardClient
      key={`${loaderData.data.selectedGroupEmail}/${loaderData.data.selectedCalendarId}`}
      initialData={loaderData.data}
      initialEventId={loaderData.eventId}
    />
  );
}
