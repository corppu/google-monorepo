import { PageTemplate } from '@gm/lib-client-common';
import {
  GenericCalendarAccessForm,
  GenericEventAccessForm,
  GenericGroupAccessForm,
  GenericUserinfoAccessForm,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo
} from '@gm/lib-client-google';

export const DashboardPage = () => (
  <PageTemplate title="Dashboard">
    <GenericUserinfoAccessForm userinfo={useGoogleUserinfo().data} />
    <GenericCalendarAccessForm calendars={useGoogleCalendars().data} />
    <GenericEventAccessForm events={useGoogleEvents().data} />
    <GenericGroupAccessForm groups={useGoogleGroups().data} />
  </PageTemplate>
);
