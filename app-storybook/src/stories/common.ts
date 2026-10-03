import type { ScopeOption } from '@gm/lib-client-common';

export const COMMON_STORY_PARAMETERS = { layout: 'centered' };

export const INITIAL_SELECTED_SCOPE_IDS = ['openid', 'userinfo.email'];

export const MOCK_SCOPES: ScopeOption[] = [
  {
    id: 'calendar.readonly',
    label: 'Read calendars and events',
    locked: false,
  },
  { id: 'openid', label: 'OpenID', locked: true },
  { id: 'userinfo.email', label: 'View your email address', locked: true },
];

export const MOCK_USER = {
  displayName: 'Ada Lovelace',
  email: 'ada@example.com',
};

export const STORY_FORM_CONFIG = {
  identifierLabel: 'Email address',
  identifierName: 'email',
};

export const toggleSelectedScope = (selected: string[], id: string) =>
  selected.includes(id)
    ? selected.filter((selectedId) => selectedId !== id)
    : [...selected, id];
