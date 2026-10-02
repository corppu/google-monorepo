import { ScreenTemplate } from '@gm/lib-native-common';
import {
  GenericCalendarAccessForm,
  GenericEventAccessForm,
  GenericGroupAccessForm,
  GenericUserinfoAccessForm,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo
} from '@gm/lib-native-google';
import { api } from '../session';

export const DashboardScreen = () => (
  <ScreenTemplate title="Dashboard">
    <GenericUserinfoAccessForm userinfo={useGoogleUserinfo(api).data} />
    <GenericCalendarAccessForm calendars={useGoogleCalendars(api).data} />
    <GenericEventAccessForm events={useGoogleEvents(api).data} />
    <GenericGroupAccessForm groups={useGoogleGroups(api).data} />
  </ScreenTemplate>
);
