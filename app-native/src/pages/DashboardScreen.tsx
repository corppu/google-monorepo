import { ScreenTemplate } from '@gm/lib-native-common';
import {
  GoogleCalendarSectionFieldset,
  GoogleEventSectionFieldset,
  GoogleGroupSectionFieldset,
  GoogleUserinfoSectionFieldset,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo,
} from '@gm/lib-native-google';
import { api } from '../session';

export const DashboardScreen = () => (
  <ScreenTemplate title="Dashboard">
    <GoogleUserinfoSectionFieldset userinfo={useGoogleUserinfo(api).data} />
    <GoogleCalendarSectionFieldset calendars={useGoogleCalendars(api).data} />
    <GoogleEventSectionFieldset events={useGoogleEvents(api).data} />
    <GoogleGroupSectionFieldset groups={useGoogleGroups(api).data} />
  </ScreenTemplate>
);
