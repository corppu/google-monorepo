'use client';

import type {
  CalendarList,
  Event,
  GoogleEventChanges,
  Group,
  GooglePublicContactInfo,
  Userinfo,
} from '@gm/lib-common-google';

import { GoogleDashboardPage } from '@gm/lib-client-google';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { saveEvent as saveEventAction } from './actions';

interface DashboardData {
  calendarId: string;
  calendars: CalendarList;
  eventId: string;
  events: Event[];
  groupId: string;
  groups: Group[];
  publicContactInfo?: GooglePublicContactInfo;
  userinfo: Userinfo;
}

export const DashboardClient = ({
  calendarId,
  calendars,
  eventId: initialEventId,
  events: initialEvents,
  groupId,
  groups,
  publicContactInfo,
  userinfo,
}: DashboardData) => {
  const navigate = useNavigate();
  const groupEmail = groups.find((group) => group.id === groupId)?.email ?? '';
  const groupSelectionParams: Record<string, string> = groupId
    ? { groupId }
    : {};
  const [eventId, setEventId] = useState(initialEventId);
  const [created, setCreated] = useState<Event[]>([]);
  const [updated, setUpdated] = useState<Record<string, Event>>({});
  useEffect(() => setEventId(initialEventId), [initialEventId]);
  const events = [
    ...initialEvents,
    ...created.filter((c) => !initialEvents.some((e) => e.id === c.id)),
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
      if (saved.id) {
        setEventId(saved.id);
        navigateTo({
          ...groupSelectionParams,
          calendarId,
          eventId: saved.id,
        });
      }
    } else if (saved.id) {
      setUpdated((current) => ({ ...current, [saved.id!]: saved }));
    }
  };
  const navigateTo = (params: Record<string, string>) =>
    navigate(`?${new URLSearchParams({ mock: 'true', ...params })}`);
  const selectEvent = (id: string) => {
    setEventId(id);
    navigateTo({
      ...groupSelectionParams,
      calendarId,
      eventId: id,
    });
  };

  return (
    <GoogleDashboardPage
      calendars={calendars}
      contactInfo={publicContactInfo}
      events={events}
      groups={groups}
      onCalendarSelect={(id) =>
        navigateTo({ ...groupSelectionParams, calendarId: id })
      }
      onEventSelect={selectEvent}
      onGroupSelect={(email) => {
        if (!email) {
          navigateTo({});
          return;
        }
        const selectedGroup = groups.find((group) => group.email === email);
        if (selectedGroup?.id) {
          navigateTo({ groupId: selectedGroup.id });
        }
      }}
      onSaveEvent={saveEvent}
      selectedCalendarId={calendarId}
      selectedEventId={eventId}
      selectedGroupEmail={groupEmail}
      userinfo={userinfo}
    />
  );
};
