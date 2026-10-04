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
import './GoogleDashboardPage.css';

export type GoogleEventChanges = Pick<Event, 'description' | 'summary'>;

export interface GoogleDashboardPageProps {
  as?: 'div' | 'main';
  calendars?: CalendarList;
  events?: Event[];
  fieldIdPrefix?: string;
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
  as,
  calendars,
  events,
  fieldIdPrefix = 'event',
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
    <PageTemplate as={as} title="Dashboard">
      <GenericForm
        className="gm-google-dashboard-page__form"
        onSubmit={(event) => event.preventDefault()}
      >
        <GoogleUserinfoAccessFormFieldset userinfo={userinfo} />
        <GoogleGroupAccessFormFieldset
          groups={groups}
          onSelect={onGroupSelect}
          selectedGroupEmail={selectedGroupEmail}
        />
        <GoogleCalendarAccessFormFieldset
          calendars={calendars}
          paginationKey={selectedGroupEmail}
          onSelect={onCalendarSelect}
          selectedCalendarId={selectedCalendarId}
        />
        {selectedCalendarId && (
          <GoogleEventAccessFormFieldset
            events={events}
            paginationKey={selectedCalendarId}
            onSelect={onEventSelect}
            selectedEventId={selectedEventId}
          />
        )}
        {selectedEvent && (
          <GoogleEventUpdateAccessFormFieldset
            idPrefix={fieldIdPrefix}
            key={selectedEvent.id}
            event={selectedEvent}
            onUpdate={onUpdateEvent}
          />
        )}
      </GenericForm>
    </PageTemplate>
  );
};
