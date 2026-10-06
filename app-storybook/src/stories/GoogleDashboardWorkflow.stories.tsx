import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import type {
  CalendarList,
  Event,
  GoogleEventChanges,
  Group,
} from '@gm/lib-common-google';
import {
  CREATE_EVENT_OPTION_ID,
  INITIAL_SELECTIONS,
  MOCK_ALL_CALENDARS,
  MOCK_EVENTS,
  MOCK_GROUPS,
  MOCK_GROUP_CALENDARS,
  MOCK_USERINFO,
} from '@gm/lib-common-google';
import type { MockWorkflowStep } from '@gm/lib-common-google';
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
type WorkflowStep = MockWorkflowStep;

const expectFieldDescriptions = (
  canvasElement: HTMLElement,
  label: string,
  descriptions: string[],
  expectedCount = 1,
) => {
  const controls = within(canvasElement).getAllByLabelText(label);
  expect(controls).toHaveLength(expectedCount);

  controls.forEach((control) => {
    expect(control.id).not.toBe('');
    const describedBy = control.getAttribute('aria-describedby');
    const descriptionIds = describedBy?.split(/\s+/).filter(Boolean) ?? [];
    expect(descriptionIds).toHaveLength(descriptions.length);

    const field = control.parentElement;
    if (!field) throw new Error(`Field wrapper missing for ${label}.`);

    descriptionIds.forEach((id, index) => {
      const description = canvasElement.ownerDocument.getElementById(id);
      if (!description)
        throw new Error(`Field description ${id} was not found.`);
      expect(field.contains(description)).toBe(true);
      expect(description).toHaveTextContent(descriptions[index]);
    });
  });
};

const DashboardWorkflow = ({
  as,
  fieldIdPrefix,
  step,
}: {
  as?: 'div' | 'main';
  fieldIdPrefix?: string;
  step: WorkflowStep;
}) => {
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
  const [createdEvents, setCreatedEvents] = useState<Record<string, Event[]>>(
    {},
  );
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const calendars = selectedGroupEmail
    ? MOCK_GROUP_CALENDARS[selectedGroupEmail]
    : MOCK_ALL_CALENDARS;
  const events = selectedCalendarId
    ? [
        ...(MOCK_EVENTS[selectedCalendarId] ?? []),
        ...(createdEvents[selectedCalendarId] ?? []),
      ]
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
  const saveEvent = async (changes: GoogleEventChanges) => {
    if (selectedEventId === CREATE_EVENT_OPTION_ID) {
      const createdEvent: Event = {
        ...changes,
        id: `storybook-${Date.now()}`,
      };
      setCreatedEvents((current) => ({
        ...current,
        [selectedCalendarId]: [
          ...(current[selectedCalendarId] ?? []),
          createdEvent,
        ],
      }));
      setSelectedEventId(createdEvent.id!);
      return;
    }
    if (!selectedEvent?.id) return;
    setUpdatedEvents((current) => ({
      ...current,
      [selectedEvent.id!]: { ...selectedEvent, ...changes },
    }));
  };

  return (
    <GoogleDashboardPage
      as={as}
      calendars={calendars}
      events={visibleEvents}
      fieldIdPrefix={fieldIdPrefix}
      groups={MOCK_GROUPS}
      onCalendarSelect={selectCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={selectGroup}
      onSaveEvent={saveEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={MOCK_USERINFO}
    />
  );
};

const NativeDashboardWorkflow = ({
  fieldIdPrefix = 'event',
  step,
}: {
  fieldIdPrefix?: string;
  step: WorkflowStep;
}) => {
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
  const [createdEvents, setCreatedEvents] = useState<Record<string, Event[]>>(
    {},
  );
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const calendars = selectedGroupEmail
    ? MOCK_GROUP_CALENDARS[selectedGroupEmail]
    : MOCK_ALL_CALENDARS;
  const events = selectedCalendarId
    ? [
        ...(MOCK_EVENTS[selectedCalendarId] ?? []),
        ...(createdEvents[selectedCalendarId] ?? []),
      ]
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
  const saveEvent = async (changes: GoogleEventChanges) => {
    if (selectedEventId === CREATE_EVENT_OPTION_ID) {
      const createdEvent: Event = {
        ...changes,
        id: `storybook-${Date.now()}`,
      };
      setCreatedEvents((current) => ({
        ...current,
        [selectedCalendarId]: [
          ...(current[selectedCalendarId] ?? []),
          createdEvent,
        ],
      }));
      setSelectedEventId(createdEvent.id!);
      return;
    }
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
      fieldIdPrefix={fieldIdPrefix}
      groups={MOCK_GROUPS}
      onCalendarSelect={chooseCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={chooseGroup}
      onSaveEvent={saveEvent}
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
      <DashboardWorkflow as="div" step={step} />
    </section>
    <section className="workflow-platform">
      <h2>Native client</h2>
      <NativeDashboardWorkflow fieldIdPrefix="native-event" step={step} />
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

export const CreateEventComparison: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const createOptions = canvas.getAllByRole('radio', {
      name: 'Create event',
    });
    expect(createOptions).toHaveLength(2);
    await userEvent.click(createOptions[0]);
    await userEvent.click(createOptions[1]);
    expect(canvas.getAllByLabelText('Event title')).toHaveLength(2);
    expect(canvas.getAllByLabelText('Start date and time')).toHaveLength(2);
    expect(canvas.getAllByLabelText('End date and time')).toHaveLength(2);
    expect(
      canvas.getAllByRole('button', { name: 'Create event' }),
    ).toHaveLength(2);
  },
  render: () => <WorkflowComparison step="event" />,
};

export const EmptyEventTitle: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText('Event title').id).toBe('event-summary-input');
    expect(canvas.getByLabelText('Description').id).toBe(
      'event-description-textarea',
    );
    expectFieldDescriptions(canvasElement, 'Event title', ['Required field']);
    expectFieldDescriptions(canvasElement, 'Description', ['Optional']);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    expectFieldDescriptions(canvasElement, 'Event title', [
      'Required field',
      'Event title is required.',
    ]);
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Event title is required.',
    );
    await expect(canvas.queryByText('Event updated.')).toBeNull();
  },
  render: () => <DashboardWorkflow step="invalid-title" />,
};

export const EmptyEventTitleComparison: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getAllByLabelText('Event title').map((field) => field.id),
    ).toEqual(['event-summary-input', 'native-event-summary-input']);
    expect(
      canvas.getAllByLabelText('Description').map((field) => field.id),
    ).toEqual([
      'event-description-textarea',
      'native-event-description-textarea',
    ]);
    expectFieldDescriptions(
      canvasElement,
      'Event title',
      ['Required field'],
      2,
    );
    expectFieldDescriptions(canvasElement, 'Description', ['Optional'], 2);
    const saveButtons = canvas.getAllByRole('button', { name: 'Save changes' });
    await userEvent.click(saveButtons[0]);
    await userEvent.click(saveButtons[1]);
    expectFieldDescriptions(
      canvasElement,
      'Event title',
      ['Required field', 'Event title is required.'],
      2,
    );
    const errors = canvas.getAllByText('Event title is required.');
    await expect(errors).toHaveLength(2);
    const alerts = canvas.getAllByRole('alert');
    await expect(alerts).toHaveLength(2);
    await expect(alerts[0]).toHaveTextContent('Event title is required.');
    await expect(alerts[1]).toHaveTextContent('Event title is required.');
    await expect(canvas.queryByText('Event updated.')).toBeNull();
  },
  render: () => <WorkflowComparison step="invalid-title" />,
};

export const EmptyEventTitleComparisonDark: Story = {
  globals: { colorMode: 'dark' },
  render: () => <WorkflowComparison step="invalid-title" />,
};

const LARGE_GROUPS: Group[] = Array.from({ length: 99 }, (_, index) => {
  const number = String(index + 1).padStart(3, '0');
  return {
    email: `group-${number}@example.com`,
    id: `group-${number}`,
    name: `Group ${number}`,
  };
});

const LARGE_CALENDARS: CalendarList = {
  items: Array.from({ length: 999 }, (_, index) => {
    const number = String(index + 1).padStart(3, '0');
    return {
      id: `calendar-${number}`,
      summary: `Calendar ${number}`,
    };
  }),
};

const LARGE_EVENTS: Event[] = Array.from({ length: 9999 }, (_, index) => {
  const number = String(index + 1).padStart(5, '0');
  return {
    description: `Description for load test event ${number}.`,
    id: `load-event-${number}`,
    summary: `Load test event ${number}`,
  };
});

const LargeDatasetWorkflow = () => {
  const [selectedGroupEmail, setSelectedGroupEmail] = useState('');
  const [selectedCalendarId, setSelectedCalendarId] = useState('calendar-001');
  const [selectedEventId, setSelectedEventId] = useState('load-event-00001');
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const groupIndex = LARGE_GROUPS.findIndex(
    (group) => group.email === selectedGroupEmail,
  );
  const calendars = selectedGroupEmail
    ? {
        items: LARGE_CALENDARS.items.filter(
          (_, index) => index % LARGE_GROUPS.length === groupIndex,
        ),
      }
    : LARGE_CALENDARS;
  const events = selectedCalendarId
    ? LARGE_EVENTS.map((event) =>
        event.id ? (updatedEvents[event.id] ?? event) : event,
      )
    : undefined;
  const selectedEvent = events?.find((event) => event.id === selectedEventId);

  const selectGroup = (groupEmail: string) => {
    setSelectedGroupEmail(groupEmail);
    setSelectedCalendarId('');
    setSelectedEventId('');
  };
  const selectCalendar = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId('');
  };
  const saveEvent = async (changes: GoogleEventChanges) => {
    if (!selectedEvent?.id) return;
    setUpdatedEvents((current) => ({
      ...current,
      [selectedEvent.id!]: { ...selectedEvent, ...changes },
    }));
  };

  return (
    <GoogleDashboardPage
      calendars={calendars}
      events={events}
      groups={LARGE_GROUPS}
      onCalendarSelect={selectCalendar}
      onEventSelect={setSelectedEventId}
      onGroupSelect={selectGroup}
      onSaveEvent={saveEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={MOCK_USERINFO}
    />
  );
};

const NativeLargeDatasetWorkflow = () => {
  const [selectedGroupEmail, setSelectedGroupEmail] = useState('');
  const [selectedCalendarId, setSelectedCalendarId] = useState('calendar-001');
  const [selectedEventId, setSelectedEventId] = useState('load-event-00001');
  const [updatedEvents, setUpdatedEvents] = useState<Record<string, Event>>({});
  const groupIndex = LARGE_GROUPS.findIndex(
    (group) => group.email === selectedGroupEmail,
  );
  const calendars = selectedGroupEmail
    ? {
        items: LARGE_CALENDARS.items.filter(
          (_, index) => index % LARGE_GROUPS.length === groupIndex,
        ),
      }
    : LARGE_CALENDARS;
  const events = selectedCalendarId
    ? LARGE_EVENTS.map((event) =>
        event.id ? (updatedEvents[event.id] ?? event) : event,
      )
    : undefined;
  const selectedEvent = events?.find((event) => event.id === selectedEventId);

  const onGroupSelect = (groupEmail: string) => {
    setSelectedGroupEmail(groupEmail);
    setSelectedCalendarId('');
    setSelectedEventId('');
  };
  const onCalendarSelect = (calendarId: string) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId('');
  };
  const saveEvent = async (changes: GoogleEventChanges) => {
    if (!selectedEvent?.id) return;
    setUpdatedEvents((current) => ({
      ...current,
      [selectedEvent.id!]: { ...selectedEvent, ...changes },
    }));
  };

  return (
    <GoogleDashboardScreen
      calendars={calendars}
      events={events}
      fieldIdPrefix="native-event"
      groups={LARGE_GROUPS}
      onCalendarSelect={onCalendarSelect}
      onEventSelect={setSelectedEventId}
      onGroupSelect={onGroupSelect}
      onSaveEvent={saveEvent}
      selectedCalendarId={selectedCalendarId}
      selectedEventId={selectedEventId}
      selectedGroupEmail={selectedGroupEmail}
      userinfo={MOCK_USERINFO}
    />
  );
};

export const LargeDataset: Story = {
  name: '99 groups, 999 calendars, 9,999 events',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const groups = within(canvas.getByRole('group', { name: 'Google group' }));
    const calendars = within(canvas.getByRole('group', { name: 'Calendars' }));
    const events = within(canvas.getByRole('group', { name: 'Events' }));

    await expect(groups.getAllByRole('radio')).toHaveLength(50);
    await expect(calendars.getAllByRole('radio')).toHaveLength(50);
    await expect(events.getAllByRole('radio')).toHaveLength(51);
    await expect(events.getByText('Items 1-50 of 9999')).toBeInTheDocument();

    await userEvent.click(events.getByRole('button', { name: 'Next page' }));

    await expect(events.getAllByRole('radio')).toHaveLength(52);
    await expect(events.getByText('Items 51-100 of 9999')).toBeInTheDocument();
    await expect(
      events.getByRole('radio', { name: 'Load test event 00001' }),
    ).toBeChecked();
    await expect(
      events.getByLabelText('Load test event 00051'),
    ).toBeInTheDocument();
  },
  render: () => <LargeDatasetWorkflow />,
};

export const NativeLargeDataset: Story = {
  name: 'Native: 99 groups, 999 calendars, 9,999 events',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('radio')).toHaveLength(151);
    const nextEventsPage = canvas.getByRole('button', {
      name: 'Next Events page',
    });
    await userEvent.click(nextEventsPage);
    await expect(canvas.getAllByRole('radio')).toHaveLength(152);
    await expect(
      canvas.getByRole('radio', { name: 'Load test event 00001' }),
    ).toBeChecked();
    await expect(
      canvas.getByRole('radio', { name: 'Load test event 00051' }),
    ).toBeInTheDocument();
  },
  render: () => <NativeLargeDatasetWorkflow />,
};
