import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_DASHBOARD_DATA } from '@gm/lib-common-google';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import type { Event, GoogleEventChanges } from '@gm/lib-common-google';
import {
  GoogleDashboardPage,
  googleApiUrl,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGooglePublicContactInfo,
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
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const { data: userinfo } = useGoogleUserinfo();
  const { data: contactInfo, error: contactInfoError } =
    useGooglePublicContactInfo();
  const { data: groups } = useGoogleGroups();
  const { data: calendars } = useGoogleCalendars(
    selectedGroupEmail || undefined,
  );
  const { data: loadedEvents } = useGoogleEvents(
    selectedCalendarId || undefined,
    Boolean(selectedCalendarId),
  );
  const events = loadedEvents
    ? [
        ...loadedEvents,
        ...createdEvents.filter(
          (created) => !loadedEvents.some((e) => e.id === created.id),
        ),
      ]
    : undefined;
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
    setCreatedEvents([]);
    setUpdatedEvents({});
  };
  const selectCalendar = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId('');
    setCreatedEvents([]);
    setUpdatedEvents({});
  };
  const saveSelectedEvent = async (changes: GoogleEventChanges) => {
    if (!selectedCalendarId) throw new Error('Select a calendar first.');
    const creating = selectedEventId === CREATE_EVENT_OPTION_ID;
    if (creating && (!changes.start?.dateTime || !changes.end?.dateTime)) {
      throw new Error('Start and end date/time are required.');
    }
    if (!creating && !selectedEvent?.id) {
      throw new Error('Select an event first.');
    }
    const query = new URLSearchParams({ calendarId: selectedCalendarId });
    const response = creating
      ? await fetch(googleApiUrl(`events?${query}`), {
          body: JSON.stringify(changes),
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
      : await fetch(
          `/api/google/events/${encodeURIComponent(selectedEvent!.id!)}?${query}`,
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
    if (creating && updatedEvent.id) {
      setCreatedEvents((current) => [...current, updatedEvent]);
      setSelectedEventId(updatedEvent.id);
    } else if (updatedEvent.id) {
      setUpdatedEvents((current) => ({
        ...current,
        [updatedEvent.id!]: updatedEvent,
      }));
    }
  };

  return (
    <GoogleDashboardPage
      calendars={calendars}
      contactInfo={contactInfo}
      contactInfoError={contactInfoError}
      events={visibleEvents}
      groups={groups}
      onCalendarSelect={selectCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={selectGroup}
      onSaveEvent={saveSelectedEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={userinfo}
    />
  );
};
