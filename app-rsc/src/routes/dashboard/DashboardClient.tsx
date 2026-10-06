'use client';

import { useState } from 'react';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import type {
  CalendarList,
  Event,
  GoogleEventChanges,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { GoogleDashboardPage } from '@gm/lib-client-google';

interface DashboardInitialData {
  calendars: CalendarList;
  events: Event[];
  groups: Group[];
  selectedCalendarId: string;
  selectedGroupEmail: string;
  userinfo: Userinfo;
}

export const DashboardClient = ({
  initialData,
  initialEventId,
}: {
  initialData: DashboardInitialData;
  initialEventId: string;
}) => {
  const [groupEmail, setGroupEmail] = useState(initialData.selectedGroupEmail);
  const [calendarId, setCalendarId] = useState(initialData.selectedCalendarId);
  const [eventId, setEventId] = useState(initialEventId);
  const [created, setCreated] = useState<Event[]>([]);
  const [updated, setUpdated] = useState<Record<string, Event>>({});
  const events = [...initialData.events, ...created].map((event) =>
    event.id ? (updated[event.id] ?? event) : event,
  );

  const saveEvent = async (changes: GoogleEventChanges) => {
    if (eventId === CREATE_EVENT_OPTION_ID) {
      const event = { ...changes, id: `mock-event-${Date.now()}` };
      setCreated((current) => [...current, event]);
      setEventId(event.id);
    } else {
      const existing = events.find((event) => event.id === eventId);
      if (existing?.id) {
        setUpdated((current) => ({
          ...current,
          [existing.id!]: { ...existing, ...changes },
        }));
      }
    }
  };

  return (
    <GoogleDashboardPage
      calendars={initialData.calendars}
      events={events}
      groups={initialData.groups}
      onCalendarSelect={(id) => {
        setCalendarId(id);
        setEventId('');
      }}
      onEventSelect={setEventId}
      onGroupSelect={(email) => {
        setGroupEmail(email);
        setCalendarId('');
        setEventId('');
      }}
      onSaveEvent={saveEvent}
      selectedCalendarId={calendarId}
      selectedEventId={eventId}
      selectedGroupEmail={groupEmail}
      userinfo={initialData.userinfo}
    />
  );
};
