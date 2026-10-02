import type { ReactElement } from 'react';
import { PageTemplate } from '@gm/lib-client-common';
import {
  GenericAuthArticleForm,
  GenericCalendarAccessForm,
  GenericEventAccessForm,
  GenericGroupAccessForm,
  GenericScopesSelectorFieldset,
  GenericUserinfoAccessForm
} from '@gm/lib-client-google';
import { GOOGLE_SCOPES, MINIMUM_SCOPES } from '@gm/lib-common-google';
import type { CalendarList, Event, Group, Userinfo } from '@gm/lib-common-google';
import { renderPage } from './renderPage';

export interface DashboardData {
  userinfo?: Userinfo;
  calendars?: CalendarList;
  events?: Event[];
  groups?: Group[];
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

export function createSSRRenderer() {
  const page = (title: string, body: ReactElement, script?: string) => renderPage(<PageTemplate title={title}>{body}</PageTemplate>, { title, script });
  return {
    landing: () => page('Sign in with Google', <GenericAuthArticleForm onSubmit={noop} />, loginScript),
    scopes: () =>
      page(
        'Choose scopes',
        <form>
          <GenericScopesSelectorFieldset scopes={GOOGLE_SCOPES} selected={MINIMUM_SCOPES} onToggle={noop} />
          <button type="submit">Authorize</button>
        </form>,
        scopesScript
      ),
    dashboard: (d: DashboardData) =>
      page(
        'Dashboard',
        <>
          <GenericUserinfoAccessForm userinfo={d.userinfo} />
          <GenericCalendarAccessForm calendars={d.calendars} />
          <GenericEventAccessForm events={d.events} />
          <GenericGroupAccessForm groups={d.groups} />
        </>
      )
  };
}
