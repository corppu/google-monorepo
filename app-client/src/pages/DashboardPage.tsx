import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_DASHBOARD_DATA } from '@gm/lib-common-google';
import type { Event } from '@gm/lib-common-google';
import {
  GoogleDashboardPage,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo,
} from '@gm/lib-client-google';

export const DashboardPage = () => {
  const location = useLocation();
  const mockMode = new URLSearchParams(location.search).get('mock') === 'true';
  const [selectedGroupEmail, setSelectedGroupEmail] = useState(() =>
    mockMode ? MOCK_DASHBOARD_DATA.selectedGroupEmail : '',
  );
  const [selectedCalendarId, setSelectedCalendarId] = useState(() =>
    mockMode ? MOCK_DASHBOARD_DATA.selectedCalendarId : '',
  );
  const [selectedEventId, setSelectedEventId] = useState(() =>
    mockMode ? MOCK_DASHBOARD_DATA.selectedEventId : '',
  );
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const { data: loadedUserinfo } = useGoogleUserinfo(!mockMode);
  const { data: loadedGroups } = useGoogleGroups(!mockMode);
  const { data: loadedCalendars } = useGoogleCalendars(
    selectedGroupEmail || undefined,
    !mockMode,
  );
  const { data: loadedEvents } = useGoogleEvents(
    selectedCalendarId || undefined,
    Boolean(selectedCalendarId) && !mockMode,
  );
  const userinfo = mockMode ? MOCK_DASHBOARD_DATA.userinfo : loadedUserinfo;
  const groups = mockMode ? MOCK_DASHBOARD_DATA.groups : loadedGroups;
  const calendars = mockMode ? MOCK_DASHBOARD_DATA.calendars : loadedCalendars;
  const events = mockMode ? MOCK_DASHBOARD_DATA.events : loadedEvents;
  const visibleEvents = events?.map((event) =>
    event.id ? (updatedEvents[event.id] ?? event) : event,
  );
  const selectedEvent = visibleEvents?.find(
    (event) => event.id === selectedEventId,
  );

  const selectGroup = (groupEmail: string) => {
    setSelectedGroupEmail(groupEmail);
    setSelectedCalendarId('');
    setSelectedEventId('');
  };
  const selectCalendar = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId('');
  };
  const updateSelectedEvent = async (
    changes: Pick<Event, 'description' | 'summary'>,
  ) => {
    if (!selectedEvent?.id || !selectedCalendarId) {
      throw new Error('Select a calendar and event first.');
    }
    if (mockMode) {
      setUpdatedEvents((current) => ({
        ...current,
        [selectedEvent.id!]: { ...selectedEvent, ...changes },
      }));
      return;
    }
    const query = new URLSearchParams({ calendarId: selectedCalendarId });
    const response = await fetch(
      `/api/google/events/${encodeURIComponent(selectedEvent.id)}?${query}`,
      {
        body: JSON.stringify(changes),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      },
    );
    if (!response.ok) {
      const result = await response.json().catch(() => undefined);
      throw new Error(result?.error ?? `Update failed (${response.status}).`);
    }
    const updatedEvent = (await response.json()) as Event;
    if (updatedEvent.id) {
      setUpdatedEvents((current) => ({
        ...current,
        [updatedEvent.id!]: updatedEvent,
      }));
    }
  };

  return (
    <GoogleDashboardPage
      calendars={calendars}
      events={visibleEvents}
      groups={groups}
      onCalendarSelect={selectCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={selectGroup}
      onUpdateEvent={updateSelectedEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={userinfo}
    />
  );
};
