import { useState } from 'react';
import { GenericForm, PageTemplate } from '@gm/lib-client-common';
import type { Event } from '@gm/lib-common-google';
import {
  GoogleCalendarAccessFormFieldset,
  GoogleEventAccessFormFieldset,
  GoogleEventUpdateAccessFormFieldset,
  GoogleGroupAccessFormFieldset,
  GoogleUserinfoAccessFormFieldset,
  useGoogleCalendars,
  useGoogleEvents,
  useGoogleGroups,
  useGoogleUserinfo,
} from '@gm/lib-client-google';

export const DashboardPage = () => {
  const [selectedGroupEmail, setSelectedGroupEmail] = useState('');
  const [selectedCalendarId, setSelectedCalendarId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const { data: userinfo } = useGoogleUserinfo();
  const { data: groups } = useGoogleGroups();
  const { data: calendars } = useGoogleCalendars(
    selectedGroupEmail || undefined,
  );
  const { data: events } = useGoogleEvents(
    selectedCalendarId || undefined,
    Boolean(selectedCalendarId),
  );
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
    <PageTemplate title="Dashboard">
      <GenericForm onSubmit={(event) => event.preventDefault()}>
        <GoogleUserinfoAccessFormFieldset userinfo={userinfo} />
        <GoogleGroupAccessFormFieldset
          groups={groups}
          selectedGroupEmail={selectedGroupEmail}
          onSelect={selectGroup}
        />
        <GoogleCalendarAccessFormFieldset
          calendars={calendars}
          selectedCalendarId={selectedCalendarId}
          onSelect={selectCalendar}
        />
        {selectedCalendarId && (
          <GoogleEventAccessFormFieldset
            events={visibleEvents}
            selectedEventId={selectedEventId}
            onSelect={setSelectedEventId}
          />
        )}
        {selectedEvent && (
          <GoogleEventUpdateAccessFormFieldset
            key={selectedEvent.id}
            event={selectedEvent}
            onUpdate={updateSelectedEvent}
          />
        )}
      </GenericForm>
    </PageTemplate>
  );
};
