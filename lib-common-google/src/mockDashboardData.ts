import type { CalendarList } from './types/CalendarList';
import type { Event } from './types/Event';
import type { Group } from './types/Group';
import type { Userinfo } from './types/Userinfo';

export type MockWorkflowStep =
  'group' | 'calendar' | 'event' | 'update' | 'invalid-title';

export const MOCK_USERINFO: Userinfo = {
  email: 'morgan.lee@example.com',
  name: 'Morgan Lee',
};

export const MOCK_GROUPS: Group[] = [
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

export const MOCK_ALL_CALENDARS: CalendarList = {
  items: [
    { id: 'product-planning', summary: 'Product planning' },
    { id: 'release-calendar', summary: 'Release calendar' },
    { id: 'operations-calendar', summary: 'Operations' },
  ],
};

export const MOCK_GROUP_CALENDARS: Record<string, CalendarList> = {
  'operations@example.com': {
    items: MOCK_ALL_CALENDARS.items.slice(2),
  },
  'product-team@example.com': {
    items: MOCK_ALL_CALENDARS.items.slice(0, 2),
  },
};

export const MOCK_EVENTS: Record<string, Event[]> = {
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
    {
      description: 'Add a title before saving this event.',
      id: 'untitled-event',
      summary: '',
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

export const INITIAL_SELECTIONS: Record<
  MockWorkflowStep,
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
  'invalid-title': {
    calendarId: 'product-planning',
    eventId: 'untitled-event',
    groupEmail: 'product-team@example.com',
  },
  update: {
    calendarId: 'product-planning',
    eventId: 'roadmap-review',
    groupEmail: 'product-team@example.com',
  },
};

const initialMockSelection = INITIAL_SELECTIONS['invalid-title'];

export const MOCK_DASHBOARD_DATA = {
  calendars: MOCK_GROUP_CALENDARS[initialMockSelection.groupEmail],
  events: MOCK_EVENTS[initialMockSelection.calendarId],
  groups: MOCK_GROUPS,
  selectedCalendarId: initialMockSelection.calendarId,
  selectedEventId: initialMockSelection.eventId,
  selectedGroupEmail: initialMockSelection.groupEmail,
  userinfo: MOCK_USERINFO,
} satisfies {
  calendars: CalendarList;
  events: Event[];
  groups: Group[];
  selectedCalendarId: string;
  selectedEventId: string;
  selectedGroupEmail: string;
  userinfo: Userinfo;
};
