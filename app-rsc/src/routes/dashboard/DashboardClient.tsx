'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { saveEvent as saveEventAction } from './actions';
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
  const navigate = useNavigate();
  const groupEmail = initialData.selectedGroupEmail;
  const calendarId = initialData.selectedCalendarId;
  const [eventId, setEventId] = useState(initialEventId);
  const [created, setCreated] = useState<Event[]>([]);
  const [updated, setUpdated] = useState<Record<string, Event>>({});
  const events = [
    ...initialData.events,
    ...created.filter((c) => !initialData.events.some((e) => e.id === c.id)),
  ].map((event) => (event.id ? (updated[event.id] ?? event) : event));

  const saveEvent = async (changes: GoogleEventChanges) => {
    const creating = eventId === CREATE_EVENT_OPTION_ID;
    const saved = (await saveEventAction(
      calendarId,
      creating ? null : eventId,
      changes,
    )) as Event;
    if (creating) {
      setCreated((current) => [...current, saved]);
      if (saved.id) setEventId(saved.id);
    } else if (saved.id) {
      setUpdated((current) => ({ ...current, [saved.id!]: saved }));
    }
  };
  const navigateTo = (params: Record<string, string>) =>
    navigate(`?${new URLSearchParams({ mock: 'true', ...params })}`);

  return (
    <GoogleDashboardPage
      calendars={initialData.calendars}
      events={events}
      groups={initialData.groups}
      onCalendarSelect={(id) => navigateTo({ calendarId: id, groupEmail })}
      onEventSelect={setEventId}
      onGroupSelect={(email) => navigateTo({ groupEmail: email })}
      onSaveEvent={saveEvent}
      selectedCalendarId={calendarId}
      selectedEventId={eventId}
      selectedGroupEmail={groupEmail}
      userinfo={initialData.userinfo}
    />
  );
};
