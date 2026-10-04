import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GenericForm, PageTemplate } from '@gm/lib-client-common';
import type {
  CalendarList,
  Event,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import {
  GoogleCalendarAccessFormFieldset,
  GoogleEventAccessFormFieldset,
  GoogleEventUpdateAccessFormFieldset,
  GoogleGroupAccessFormFieldset,
  GoogleUserinfoAccessFormFieldset,
} from '@gm/lib-client-google';
import './GoogleDashboardWorkflow.css';
import { COMMON_STORY_PARAMETERS } from './common';

const meta = {
  parameters: COMMON_STORY_PARAMETERS,
  title: 'Google Dashboard/Workflow',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;
type WorkflowStep = 'group' | 'calendar' | 'event' | 'update';

const MOCK_USERINFO: Userinfo = {
  email: 'morgan.lee@example.com',
  name: 'Morgan Lee',
};

const MOCK_GROUPS: Group[] = [
  {
    email: 'product-team@example.com',
    id: 'product-team',
    name: 'Product team',
  },
  {
    email: 'operations@example.com',
    id: 'operations',
    name: 'Operations',
  },
];

const MOCK_ALL_CALENDARS: CalendarList = {
  items: [
    { id: 'product-planning', summary: 'Product planning' },
    { id: 'release-calendar', summary: 'Release calendar' },
    { id: 'operations-calendar', summary: 'Operations' },
  ],
};

const MOCK_GROUP_CALENDARS: Record<string, CalendarList> = {
  'operations@example.com': {
    items: MOCK_ALL_CALENDARS.items.slice(2),
  },
  'product-team@example.com': {
    items: MOCK_ALL_CALENDARS.items.slice(0, 2),
  },
};

const MOCK_EVENTS: Record<string, Event[]> = {
  'operations-calendar': [
    {
      description: 'Review the weekly operations checklist.',
      id: 'weekly-operations',
      summary: 'Weekly operations review',
    },
  ],
  'product-planning': [
    {
      description: 'Review the next product milestone.',
      id: 'roadmap-review',
      summary: 'Roadmap review',
    },
    {
      description: 'Agree on the release scope.',
      id: 'scope-planning',
      summary: 'Release scope planning',
    },
  ],
  'release-calendar': [
    {
      description: 'Prepare the release notes and final checks.',
      id: 'release-readiness',
      summary: 'Release readiness review',
    },
  ],
};

const INITIAL_SELECTIONS: Record<
  WorkflowStep,
  { calendarId: string; eventId: string; groupEmail: string }
> = {
  calendar: {
    calendarId: '',
    eventId: '',
    groupEmail: 'product-team@example.com',
  },
  event: {
    calendarId: 'product-planning',
    eventId: '',
    groupEmail: 'product-team@example.com',
  },
  group: { calendarId: '', eventId: '', groupEmail: '' },
  update: {
    calendarId: 'product-planning',
    eventId: 'roadmap-review',
    groupEmail: 'product-team@example.com',
  },
};

const DashboardWorkflow = ({ step }: { step: WorkflowStep }) => {
  const initialSelection = INITIAL_SELECTIONS[step];
  const [selectedGroupEmail, setSelectedGroupEmail] = useState(
    initialSelection.groupEmail,
  );
  const [selectedCalendarId, setSelectedCalendarId] = useState(
    initialSelection.calendarId,
  );
  const [selectedEventId, setSelectedEventId] = useState(
    initialSelection.eventId,
  );
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const calendars = selectedGroupEmail
    ? MOCK_GROUP_CALENDARS[selectedGroupEmail]
    : MOCK_ALL_CALENDARS;
  const events = selectedCalendarId
    ? MOCK_EVENTS[selectedCalendarId]
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
  };
  const selectCalendar = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId('');
  };
  const updateEvent = async (
    changes: Pick<Event, 'description' | 'summary'>,
  ) => {
    if (!selectedEvent?.id) return;
    setUpdatedEvents((current) => ({
      ...current,
      [selectedEvent.id!]: { ...selectedEvent, ...changes },
    }));
  };

  return (
    <PageTemplate title="Dashboard">
      <GenericForm
        onSubmit={(event) => event.preventDefault()}
        style={{ display: 'grid', gap: 16, maxWidth: 560 }}
      >
        <GoogleUserinfoAccessFormFieldset userinfo={MOCK_USERINFO} />
        <GoogleGroupAccessFormFieldset
          groups={MOCK_GROUPS}
          onSelect={selectGroup}
          selectedGroupEmail={selectedGroupEmail}
        />
        <GoogleCalendarAccessFormFieldset
          calendars={calendars}
          onSelect={selectCalendar}
          selectedCalendarId={selectedCalendarId}
        />
        {selectedCalendarId && (
          <GoogleEventAccessFormFieldset
            events={visibleEvents}
            onSelect={setSelectedEventId}
            selectedEventId={selectedEventId}
          />
        )}
        {selectedEvent && (
          <GoogleEventUpdateAccessFormFieldset
            key={selectedEvent.id}
            event={selectedEvent}
            onUpdate={updateEvent}
          />
        )}
      </GenericForm>
    </PageTemplate>
  );
};

const NativeDashboardWorkflow = ({ step }: { step: WorkflowStep }) => {
  const initialSelection = INITIAL_SELECTIONS[step];
  const [selectedGroupEmail, setSelectedGroupEmail] = useState(
    initialSelection.groupEmail,
  );
  const [selectedCalendarId, setSelectedCalendarId] = useState(
    initialSelection.calendarId,
  );
  const [selectedEventId, setSelectedEventId] = useState(
    initialSelection.eventId,
  );
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const [saved, setSaved] = useState(false);
  const calendars = selectedGroupEmail
    ? MOCK_GROUP_CALENDARS[selectedGroupEmail]
    : MOCK_ALL_CALENDARS;
  const events = selectedCalendarId
    ? MOCK_EVENTS[selectedCalendarId]
    : undefined;
  const visibleEvents = events?.map((event) =>
    event.id ? (updatedEvents[event.id] ?? event) : event,
  );
  const selectedEvent = visibleEvents?.find(
    (event) => event.id === selectedEventId,
  );

  const chooseGroup = (groupEmail: string) => {
    setSelectedGroupEmail(groupEmail);
    setSelectedCalendarId('');
    setSelectedEventId('');
  };
  const chooseCalendar = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId('');
  };
  const updateEvent = (changes: Pick<Event, 'description' | 'summary'>) => {
    if (!selectedEvent?.id) return;
    setUpdatedEvents((current) => ({
      ...current,
      [selectedEvent.id!]: { ...selectedEvent, ...changes },
    }));
    setSaved(true);
  };

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <NativeSection title="Userinfo">
        <Text>{MOCK_USERINFO.name}</Text>
        <Text>{MOCK_USERINFO.email}</Text>
      </NativeSection>
      <NativeSection title="Google group">
        <NativeChoice
          label="All calendars"
          selected={!selectedGroupEmail}
          onPress={() => chooseGroup('')}
        />
        {MOCK_GROUPS.map((group) =>
          group.email ? (
            <NativeChoice
              key={group.id ?? group.email}
              label={group.name ?? group.email}
              selected={selectedGroupEmail === group.email}
              onPress={() => chooseGroup(group.email!)}
            />
          ) : null,
        )}
      </NativeSection>
      <NativeSection title="Calendars">
        {calendars.items.map((calendar) =>
          calendar.id ? (
            <NativeChoice
              key={calendar.id}
              label={calendar.summary ?? calendar.id}
              selected={selectedCalendarId === calendar.id}
              onPress={() => chooseCalendar(calendar.id!)}
            />
          ) : null,
        )}
      </NativeSection>
      {selectedCalendarId && (
        <NativeSection title="Events">
          {visibleEvents?.map((event) =>
            event.id ? (
              <NativeChoice
                key={event.id}
                label={event.summary ?? event.id}
                selected={selectedEventId === event.id}
                onPress={() => {
                  setSelectedEventId(event.id!);
                  setSaved(false);
                }}
              />
            ) : null,
          )}
        </NativeSection>
      )}
      {selectedEvent && (
        <NativeEventEditor
          key={selectedEvent.id}
          event={selectedEvent}
          onSave={updateEvent}
          saved={saved}
        />
      )}
    </View>
  );
};

const NativeSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <View style={{ borderColor: '#aab6bf', borderWidth: 1, gap: 8, padding: 12 }}>
    <Text style={{ fontSize: 16, fontWeight: '700' }}>{title}</Text>
    {children}
  </View>
);

const NativeChoice = ({
  label,
  onPress,
  selected,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) => (
  <Pressable
    accessibilityRole="radio"
    accessibilityState={{ checked: selected }}
    onPress={onPress}
    style={{
      backgroundColor: selected ? '#e5f1f4' : '#ffffff',
      borderColor: selected ? '#236b7c' : '#d2d9de',
      borderRadius: 4,
      borderWidth: 1,
      padding: 8,
    }}
  >
    <Text>{label}</Text>
  </Pressable>
);

const NativeEventEditor = ({
  event,
  onSave,
  saved,
}: {
  event: Event;
  onSave: (changes: Pick<Event, 'description' | 'summary'>) => void;
  saved: boolean;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');

  return (
    <NativeSection title="Update event">
      <Text>Event title</Text>
      <TextInput
        accessibilityLabel="Event title"
        onChangeText={setSummary}
        style={{ borderColor: '#aab6bf', borderWidth: 1, padding: 8 }}
        value={summary}
      />
      <Text>Description</Text>
      <TextInput
        accessibilityLabel="Description"
        multiline
        onChangeText={setDescription}
        style={{
          borderColor: '#aab6bf',
          borderWidth: 1,
          minHeight: 80,
          padding: 8,
        }}
        value={description}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => onSave({ description, summary })}
        style={{
          alignSelf: 'flex-start',
          backgroundColor: '#e5f1f4',
          padding: 10,
        }}
      >
        <Text>Save changes</Text>
      </Pressable>
      {saved && <Text accessibilityLiveRegion="polite">Event updated.</Text>}
    </NativeSection>
  );
};

const WorkflowComparison = ({ step }: { step: WorkflowStep }) => (
  <main className="workflow-comparison">
    <section className="workflow-platform">
      <h2>Web client</h2>
      <DashboardWorkflow step={step} />
    </section>
    <section className="workflow-platform">
      <h2>Native client</h2>
      <NativeDashboardWorkflow step={step} />
    </section>
  </main>
);

export const GroupSelection: Story = {
  render: () => <DashboardWorkflow step="group" />,
};

export const CalendarSelection: Story = {
  render: () => <DashboardWorkflow step="calendar" />,
};

export const EventSelection: Story = {
  render: () => <DashboardWorkflow step="event" />,
};

export const EventUpdate: Story = {
  render: () => <DashboardWorkflow step="update" />,
};

export const GroupSelectionComparison: Story = {
  render: () => <WorkflowComparison step="group" />,
};

export const CalendarSelectionComparison: Story = {
  render: () => <WorkflowComparison step="calendar" />,
};

export const EventSelectionComparison: Story = {
  render: () => <WorkflowComparison step="event" />,
};

export const EventUpdateComparison: Story = {
  render: () => <WorkflowComparison step="update" />,
};
