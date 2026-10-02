import { ScreenTemplate } from '@gm/lib-native-common';
import {
  GoogleCalendarAccessForm,
  GoogleEventAccessForm,
  GoogleGroupAccessForm,
  GoogleUserinfoAccessForm,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo
} from '@gm/lib-native-google';
import { api } from '../session';

export const DashboardScreen = () => (
  <ScreenTemplate title="Dashboard">
    <GoogleUserinfoAccessForm userinfo={useGoogleUserinfo(api).data} />
    <GoogleCalendarAccessForm calendars={useGoogleCalendars(api).data} />
    <GoogleEventAccessForm events={useGoogleEvents(api).data} />
    <GoogleGroupAccessForm groups={useGoogleGroups(api).data} />
  </ScreenTemplate>
);
