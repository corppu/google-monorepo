import {
  CREATE_EVENT_OPTION_ID,
  MOCK_DASHBOARD_DATA,
} from '@gm/lib-common-google';
import { createMockGoogleServices } from '@gm/lib-rest-google';

import { DashboardClient } from './DashboardClient';

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const services = createMockGoogleServices();
  const [userinfo, groups, publicContactInfo] = await Promise.all([
    services.user.get(),
    services.groups.list(),
    services.contactInfo.get(),
  ]);
  const params = url.searchParams;
  // With no selection in the URL, start from the shared mock selection.
  const useMockSelection =
    !params.get('groupId') &&
    !params.get('calendarId') &&
    !params.get('eventId');
  const selectedGroup = groups.find((group) =>
    useMockSelection
      ? group.email === MOCK_DASHBOARD_DATA.selectedGroupEmail
      : group.id === params.get('groupId'),
  );
  const calendars = await services.calendars.list(
    selectedGroup?.email || undefined,
  );
  const calendarId = useMockSelection
    ? MOCK_DASHBOARD_DATA.selectedCalendarId
    : (params.get('calendarId') ?? '');
  const events = calendarId ? await services.events.list(calendarId) : [];
  const eventId = useMockSelection
    ? MOCK_DASHBOARD_DATA.selectedEventId
    : url.searchParams.get('eventId') === CREATE_EVENT_OPTION_ID
      ? CREATE_EVENT_OPTION_ID
      : (url.searchParams.get('eventId') ?? '');
  return {
    calendarId,
    calendars,
    eventId,
    events,
    groupId: selectedGroup?.id ?? '',
    groups,
    publicContactInfo,
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
