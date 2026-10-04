import type { ReactElement } from 'react';
import {
  GenericAuthArticleForm,
  GenericForm,
  GenericScopesSelectorFieldset,
  PageTemplate,
} from '@gm/lib-client-common';
import {
  GoogleCalendarAccessFormFieldset,
  GoogleEventAccessFormFieldset,
  GoogleGroupAccessFormFieldset,
  GoogleRouter,
  GoogleUserinfoAccessFormFieldset,
} from '@gm/lib-client-google';
import { GOOGLE_SCOPES, MINIMUM_SCOPES } from '@gm/lib-common-google';
import type {
  CalendarList,
  Event,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { renderPage } from './renderPage';

export interface DashboardData {
  calendars?: CalendarList;
  events?: Event[];
  groups?: Group[];
  userinfo?: Userinfo;
}

const noop = () => {};

const loginScript = `
document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var f = e.target;
  var r = await fetch('/api/google/auth/login', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gmail: f.gmail.value, password: f.password.value }) });
  if (r.ok) location.href = '/ssr/google/scopes'; else alert('Login failed');
});`;

const scopesScript = `
document.querySelector('form').addEventListener('submit', async function (e) {
  e.preventDefault();
  var scopes = Array.prototype.map.call(document.querySelectorAll('input[type=checkbox]:checked'), function (c) { return c.value; });
  await fetch('/api/google/auth/scopes', { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scopes: scopes }) });
  location.href = '/api/google/auth/start?target=ssr';
});`;

const page = (title: string, body: ReactElement) => (
  <PageTemplate title={title}>{body}</PageTemplate>
);

/** Renders the pages of GoogleRouter (React Router) on the server with ReactDOMServer. */
export function createSSRRenderer() {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/google': 'Sign in with Google',
    '/google/scopes': 'Choose scopes',
  };
  const scripts: Record<string, string> = {
    '/google': loginScript,
    '/google/scopes': scopesScript,
  };

  /** `path` is relative to /ssr, e.g. `/google/scopes`. */
  return (path: string, data: DashboardData = {}): string => {
    const pages = {
      dashboard: page(
        'Dashboard',
        <GenericForm>
          <GoogleUserinfoAccessFormFieldset userinfo={data.userinfo} />
          <GoogleCalendarAccessFormFieldset calendars={data.calendars} />
          <GoogleEventAccessFormFieldset events={data.events} />
          <GoogleGroupAccessFormFieldset groups={data.groups} />
        </GenericForm>,
      ),
      landing: page(
        'Sign in with Google',
        <GenericAuthArticleForm
          identifierLabel="Gmail"
          identifierName="gmail"
          onSubmit={noop}
        />,
      ),
      scopes: page(
        'Choose scopes',
        <GenericForm>
          <GenericScopesSelectorFieldset
            scopes={GOOGLE_SCOPES}
            selected={MINIMUM_SCOPES}
            onToggle={noop}
          />
          <button type="submit">Authorize</button>
        </GenericForm>,
      ),
    };
    return renderPage(<GoogleRouter pages={pages} />, {
      location: path,
      script: scripts[path],
      title: titles[path] ?? 'Google',
    });
  };
}
