import { GenericForm, PageTemplate } from '@gm/lib-client-common';
import type {
  CalendarList,
  Event,
  GoogleEventChanges,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import { GoogleCalendarSectionFieldset } from '../organisms/GoogleCalendarSectionFieldset';
import { GoogleEventSectionFieldset } from '../organisms/GoogleEventSectionFieldset';
import { GoogleEventEditorFieldset } from '../organisms/GoogleEventEditorFieldset';
import { GoogleGroupSectionFieldset } from '../organisms/GoogleGroupSectionFieldset';
import { GoogleUserinfoSectionFieldset } from '../organisms/GoogleUserinfoSectionFieldset';
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
        <GoogleUserinfoSectionFieldset userinfo={userinfo} />
        <GoogleGroupSectionFieldset
          groups={groups}
          onSelect={onGroupSelect}
          selectedGroupEmail={selectedGroupEmail}
        />
        <GoogleCalendarSectionFieldset
          calendars={calendars}
          paginationKey={selectedGroupEmail}
          onSelect={onCalendarSelect}
          selectedCalendarId={selectedCalendarId}
        />
        {selectedCalendarId && (
          <GoogleEventSectionFieldset
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
