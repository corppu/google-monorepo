import { PageTemplate } from '@gm/lib-client-common';
import {
  GoogleCalendarAccessForm,
  GoogleEventAccessForm,
  GoogleGroupAccessForm,
  GoogleUserinfoAccessForm,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo,
} from '@gm/lib-client-google';

export const DashboardPage = () => (
  <PageTemplate title="Dashboard">
    <GoogleUserinfoAccessForm userinfo={useGoogleUserinfo().data} />
    <GoogleCalendarAccessForm calendars={useGoogleCalendars().data} />
    <GoogleEventAccessForm events={useGoogleEvents().data} />
    <GoogleGroupAccessForm groups={useGoogleGroups().data} />
  </PageTemplate>
);
