import { GenericForm, PageTemplate } from '@gm/lib-client-common';
import type {
  CalendarList,
  Event,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { GoogleCalendarAccessFormFieldset } from '../organisms/GoogleCalendarAccessFormFieldset';
import { GoogleEventAccessFormFieldset } from '../organisms/GoogleEventAccessFormFieldset';
import { GoogleEventUpdateAccessFormFieldset } from '../organisms/GoogleEventUpdateAccessFormFieldset';
import { GoogleGroupAccessFormFieldset } from '../organisms/GoogleGroupAccessFormFieldset';
import { GoogleUserinfoAccessFormFieldset } from '../organisms/GoogleUserinfoAccessFormFieldset';

export type GoogleEventChanges = Pick<Event, 'description' | 'summary'>;

export interface GoogleDashboardPageProps {
  calendars?: CalendarList;
  events?: Event[];
  groups?: Group[];
  onCalendarSelect: (calendarId: string) => void;
  onEventSelect: (eventId: string) => void;
  onGroupSelect: (groupEmail: string) => void;
  onUpdateEvent: (changes: GoogleEventChanges) => Promise<void>;
  selectedCalendarId: string;
  selectedEventId: string;
  selectedGroupEmail: string;
  userinfo?: Userinfo;
}

export const GoogleDashboardPage = ({
  calendars,
  events,
  groups,
  onCalendarSelect,
  onEventSelect,
  onGroupSelect,
  onUpdateEvent,
  selectedCalendarId,
  selectedEventId,
  selectedGroupEmail,
  userinfo,
}: GoogleDashboardPageProps) => {
  const selectedEvent = events?.find((event) => event.id === selectedEventId);

  return (
    <PageTemplate title="Dashboard">
      <GenericForm onSubmit={(event) => event.preventDefault()}>
        <GoogleUserinfoAccessFormFieldset userinfo={userinfo} />
        <GoogleGroupAccessFormFieldset
          groups={groups}
          onSelect={onGroupSelect}
          selectedGroupEmail={selectedGroupEmail}
        />
        <GoogleCalendarAccessFormFieldset
          calendars={calendars}
          onSelect={onCalendarSelect}
          selectedCalendarId={selectedCalendarId}
        />
        {selectedCalendarId && (
          <GoogleEventAccessFormFieldset
            events={events}
            onSelect={onEventSelect}
            selectedEventId={selectedEventId}
          />
        )}
        {selectedEvent && (
          <GoogleEventUpdateAccessFormFieldset
            key={selectedEvent.id}
            event={selectedEvent}
            onUpdate={onUpdateEvent}
          />
        )}
      </GenericForm>
    </PageTemplate>
  );
};
