import type {
  CalendarList,
  Event,
  GooglePublicContactInfo,
  Group,
  Userinfo,
} from '@gm/lib-common-google';

export interface DashboardData {
  calendars?: CalendarList;
  events?: Event[];
  groups?: Group[];
  publicContactInfo?: GooglePublicContactInfo;
  publicContactInfoError?: string;
  selectedCalendarId: string;
  selectedEventId: string;
  selectedGroupEmail: string;
  userinfo?: Userinfo;
}

export const SSR_BASENAME = '/ssr';
export const SSR_ASSETS_PATH = `${SSR_BASENAME}/assets`;
export const SSR_DATA_ELEMENT_ID = 'ssr-data';
export const SSR_ROOT_ELEMENT_ID = 'root';
