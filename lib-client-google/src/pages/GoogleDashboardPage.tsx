import { GenericForm, PageTemplate } from '@gm/lib-client-common';
import type {
  CalendarList,
  Event,
  GoogleEventChanges,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import { GoogleCalendarAccessFormFieldset } from '../organisms/GoogleCalendarAccessFormFieldset';
import { GoogleEventAccessFormFieldset } from '../organisms/GoogleEventAccessFormFieldset';
import { GoogleEventEditorFieldset } from '../organisms/GoogleEventEditorFieldset';
import { GoogleGroupAccessFormFieldset } from '../organisms/GoogleGroupAccessFormFieldset';
import { GoogleUserinfoAccessFormFieldset } from '../organisms/GoogleUserinfoAccessFormFieldset';
import './GoogleDashboardPage.css';

export interface GoogleDashboardPageProps {
  as?: 'div' | 'main';
  calendars?: CalendarList;
  events?: Event[];
  fieldIdPrefix?: string;
  groups?: Group[];
  onCalendarSelect: (calendarId: string) => void;
  onEventSelect: (eventId: string) => void;
  onGroupSelect: (groupEmail: string) => void;
  onSaveEvent: (changes: GoogleEventChanges) => Promise<void>;
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
  onSaveEvent,
  selectedCalendarId,
  selectedEventId,
  selectedGroupEmail,
  userinfo,
}: GoogleDashboardPageProps) => {
  const selectedEvent = events?.find((event) => event.id === selectedEventId);
  const creatingEvent = selectedEventId === CREATE_EVENT_OPTION_ID;

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
        {creatingEvent && (
          <GoogleEventEditorFieldset
            event={{}}
            idPrefix="create-event"
            mode="create"
            onSave={onSaveEvent}
          />
        )}
        {selectedEvent && !creatingEvent && (
          <GoogleEventEditorFieldset
            event={selectedEvent}
            idPrefix={fieldIdPrefix}
            key={selectedEvent.id}
            mode="update"
            onSave={onSaveEvent}
          />
        )}
      </GenericForm>
    </PageTemplate>
  );
};
