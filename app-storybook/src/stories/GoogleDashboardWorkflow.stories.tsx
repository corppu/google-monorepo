import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type {
  CalendarList,
  Event,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { GoogleDashboardPage } from '@gm/lib-client-google/src/pages/GoogleDashboardPage';
import { GoogleDashboardScreen } from '@gm/lib-native-google/src/pages/GoogleDashboardScreen';
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
    <GoogleDashboardPage
      calendars={calendars}
      events={visibleEvents}
      groups={MOCK_GROUPS}
      onCalendarSelect={selectCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={selectGroup}
      onUpdateEvent={updateEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={MOCK_USERINFO}
    />
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
    <GoogleDashboardScreen
      calendars={calendars}
      events={visibleEvents}
      groups={MOCK_GROUPS}
      onCalendarSelect={chooseCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={chooseGroup}
      onUpdateEvent={updateEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={MOCK_USERINFO}
    />
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
