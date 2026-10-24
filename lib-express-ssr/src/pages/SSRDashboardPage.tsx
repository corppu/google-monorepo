import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import { GoogleDashboardPage } from '@gm/lib-client-google';
import {
  CREATE_EVENT_OPTION_ID,
  type Event,
  type GoogleEventChanges,
} from '@gm/lib-common-google';
import type { DashboardData } from '../types';

/** Selection lives in the URL, so every change re-runs the route loader. */
export const SSRDashboardPage = () => {
  const data = useLoaderData() as DashboardData;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const go = (update: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    update(next);
    navigate({ search: next.toString() });
  };
  const selectGroup = (groupEmail: string) =>
    go((next) => {
      next.set('groupEmail', groupEmail);
      next.delete('calendarId');
      next.delete('createEvent');
      next.delete('eventId');
    });
  const selectCalendar = (calendarId: string) =>
    go((next) => {
      next.set('calendarId', calendarId);
      next.delete('createEvent');
      next.delete('eventId');
    });
  const selectEvent = (eventId: string) =>
    go((next) => {
      next.delete('createEvent');
      next.delete('eventId');
      if (eventId === CREATE_EVENT_OPTION_ID) next.set('createEvent', 'true');
      else next.set('eventId', eventId);
    });

  const saveEvent = async (changes: GoogleEventChanges) => {
    const creating = data.selectedEventId === CREATE_EVENT_OPTION_ID;
    if (!data.selectedCalendarId) throw new Error('Select a calendar first.');
    if (creating && (!changes.start?.dateTime || !changes.end?.dateTime)) {
      throw new Error('Start and end date/time are required.');
    }
    if (!creating && !data.selectedEventId) {
      throw new Error('Select an event first.');
    }
    const query = new URLSearchParams({ calendarId: data.selectedCalendarId });
    if (searchParams.get('mock') === 'true') query.set('mock', 'true');
    const url = creating
      ? `/api/google/events?${query}`
      : `/api/google/events/${encodeURIComponent(data.selectedEventId)}?${query}`;
    const response = await fetch(url, {
      body: JSON.stringify(changes),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: creating ? 'POST' : 'PATCH',
    });
    if (!response.ok) {
      const result = await response.json().catch(() => undefined);
      throw new Error(result?.error ?? `Update failed (${response.status}).`);
    }
    const saved = (await response.json()) as Event;
    selectEvent(saved.id ?? data.selectedEventId);
  };

  return (
    <GoogleDashboardPage
      calendars={data.calendars}
      contactInfo={data.publicContactInfo}
      contactInfoError={data.publicContactInfoError}
      events={data.events}
      groups={data.groups}
      onCalendarSelect={selectCalendar}
      onEventSelect={selectEvent}
      onGroupSelect={selectGroup}
      onSaveEvent={saveEvent}
      selectedCalendarId={data.selectedCalendarId}
      selectedEventId={data.selectedEventId}
      selectedGroupEmail={data.selectedGroupEmail}
      userinfo={data.userinfo}
    />
  );
};
