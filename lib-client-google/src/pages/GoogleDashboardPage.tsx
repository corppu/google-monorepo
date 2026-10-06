import { GenericForm, PageTemplate } from '@gm/lib-client-common';
import type {
  CalendarList,
  Event,
  GooglePublicContactInfo,
  GoogleEventChanges,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import { GoogleCalendarSectionFieldset } from '../organisms/GoogleCalendarSectionFieldset';
import { GoogleEventSectionFieldset } from '../organisms/GoogleEventSectionFieldset';
import { GoogleEventEditorFieldset } from '../organisms/GoogleEventEditorFieldset';
import { GoogleEventInfo } from '../organisms/GoogleEventInfo';
import { GoogleGroupSectionFieldset } from '../organisms/GoogleGroupSectionFieldset';
import { GoogleGroupInfo } from '../organisms/GoogleGroupInfo';
import { GoogleUserinfoSectionFieldset } from '../organisms/GoogleUserinfoSectionFieldset';
import './GoogleDashboardPage.css';

export interface GoogleDashboardPageProps {
  as?: 'div' | 'main';
  calendars?: CalendarList;
  contactInfo?: GooglePublicContactInfo;
  contactInfoError?: string;
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
  contactInfo,
  contactInfoError,
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
  const creatingEvent = selectedEventId === CREATE_EVENT_OPTION_ID;
  const selectedEvent =
    selectedEventId && !creatingEvent
      ? events?.find(
          (event) => event.id === selectedEventId && Boolean(event.id),
        )
      : undefined;
  const selectedGroup = groups?.find(
    (group) => group.email === selectedGroupEmail,
  );

  return (
    <PageTemplate as={as} title="Dashboard">
      <GenericForm
        className="gm-google-dashboard-page__form"
        onSubmit={(event) => event.preventDefault()}
      >
        <GoogleUserinfoSectionFieldset
          contactInfo={contactInfo}
          contactInfoError={contactInfoError}
          userinfo={userinfo}
        />
        <GoogleGroupSectionFieldset
          groups={groups}
          onSelect={onGroupSelect}
          selectedGroupEmail={selectedGroupEmail}
        />
        {selectedGroup && <GoogleGroupInfo group={selectedGroup} />}
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
        {selectedEvent && <GoogleEventInfo event={selectedEvent} />}
        {creatingEvent && (
          <GoogleEventEditorFieldset
            event={{}}
            idPrefix="create-event"
            mode="create"
            onSave={onSaveEvent}
          />
        )}
        {selectedEvent && (
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
