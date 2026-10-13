import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import { createMockGoogleServices } from '@gm/lib-rest-google';
import { DashboardClient } from './DashboardClient';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const services = createMockGoogleServices();
  const [userinfo, groups] = await Promise.all([
    services.user.get(),
    services.groups.list(),
  ]);
  const selectedGroup = groups.find(
    (group) => group.id === url.searchParams.get('groupId'),
  );
  const calendars = await services.calendars.list(
    selectedGroup?.email || undefined,
  );
  const calendarId = url.searchParams.get('calendarId') ?? '';
  const events = calendarId ? await services.events.list(calendarId) : [];
  const eventId =
    url.searchParams.get('eventId') === CREATE_EVENT_OPTION_ID
      ? CREATE_EVENT_OPTION_ID
      : (url.searchParams.get('eventId') ?? '');
  return {
    calendarId,
    calendars,
    eventId,
    events,
    groupId: selectedGroup?.id ?? '',
    groups,
    userinfo,
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
      key={`${loaderData.groupId}/${loaderData.calendarId}`}
      {...loaderData}
    />
  );
}
