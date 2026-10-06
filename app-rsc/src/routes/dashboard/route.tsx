import {
  CREATE_EVENT_OPTION_ID,
  MOCK_DASHBOARD_DATA,
} from '@gm/lib-common-google';
import { DashboardClient } from './DashboardClient';

export function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const eventId =
    url.searchParams.get('createEvent') === 'true'
      ? CREATE_EVENT_OPTION_ID
      : (url.searchParams.get('eventId') ??
        MOCK_DASHBOARD_DATA.selectedEventId);
  return { eventId };
}

// Server component: the mock data is rendered to HTML on the server and the
// interactive client component hydrates from the same props.
export default function DashboardRoute({
  loaderData,
}: {
  loaderData: { eventId: string };
}) {
  return (
    <DashboardClient
      initialData={MOCK_DASHBOARD_DATA}
      initialEventId={loaderData.eventId}
    />
  );
}
